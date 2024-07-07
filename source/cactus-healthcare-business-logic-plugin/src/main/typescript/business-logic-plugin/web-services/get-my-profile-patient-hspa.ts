import { Express, Request, Response } from "express";

import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
  IAsyncProvider,
  safeStringifyException,
} from "@hyperledger/cactus-common";
import {
  IEndpointAuthzOptions,
  IExpressRequestHandler,
  IWebServiceEndpoint,
} from "@hyperledger/cactus-core-api";
import { registerWebServiceEndpoint } from "@hyperledger/cactus-core";

import {
  DefaultApi as FabricApi,
  FabricContractInvocationType,
  RunTransactionRequest,
} from "@hyperledger/cactus-plugin-ledger-connector-fabric";

import OAS from "../../../json/openapi.json";

export interface IListDataHspAOptions {
  readonly logLevel?: LogLevelDesc;
  readonly fabricApi: FabricApi;
  readonly keychainId: string;
}

export class GetMyProfilePatientA implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "GetMyProfilePatientA";
  private readonly log: Logger;
  private readonly keychainId: string;

  public get className(): string {
    return GetMyProfilePatientA.CLASS_NAME;
  }

  public getOasPath(): (typeof OAS.paths)["/api/cactus-healthcare-backend/get-my-profile-patient-hspa"] {
    return OAS.paths[
      "/api/cactus-healthcare-backend/get-my-profile-patient-hspa"
    ];
  }

  getPath(): string {
    const apiPath = this.getOasPath();
    return apiPath.get["x-hyperledger-cactus"].http.path;
  }

  getVerbLowerCase(): string {
    const apiPath = this.getOasPath();
    return apiPath.get["x-hyperledger-cactus"].http.verbLowerCase;
  }

  public getOperationId(): string {
    return this.getOasPath().get.operationId;
  }

  constructor(public readonly opts: IListDataHspAOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(opts, `${fnTag} arg options`);
    Checks.truthy(opts.fabricApi, `${fnTag} options.fabricApi`);
    Checks.truthy(opts.keychainId, `${fnTag} options.keychainId`);
    const level = this.opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });

    this.keychainId = opts.keychainId;
  }

  getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions> {
    // TODO: make this an injectable dependency in the constructor
    return {
      get: async () => ({
        isProtected: true,
        requiredRoles: [],
      }),
    };
  }

  public async registerExpress(
    expressApp: Express,
  ): Promise<IWebServiceEndpoint> {
    await registerWebServiceEndpoint(expressApp, this);
    return this;
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  async handleRequest(req: Request, res: Response): Promise<void> {
    const tag = `${this.getVerbLowerCase().toUpperCase()} ${this.getPath()}`;
    try {
      this.log.debug(`${tag}`);
        const request: RunTransactionRequest = {
        signingCredential: {
          keychainId: this.keychainId,
          keychainRef: "ea8aebfa-4007-50b4-9bbc-3e053aad75c9",
        },
        channelName: "mychannel",
        contractName: "EHRContract",
        invocationType: FabricContractInvocationType.Call,
        methodName: "GetMyProfilePatient",
        params:["caba15bf-62f4-56f4-878e-da8e9272a7d8"],
      };
      const {
        data: { functionOutput },
      } = await this.opts.fabricApi.runTransactionV1(request);
      const output = JSON.parse(functionOutput);
      const body = { data: output };
      res.status(200);
      res.json(body);
    } catch (ex: unknown) {
      const exStr = safeStringifyException(ex);
      this.log.debug(`${tag} Failed to serve request:`, ex);
      res.status(500);
      res.json({ error: exStr });
    }
  }
}
