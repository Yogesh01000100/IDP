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
import { PluginLedgerConnectorEthereum } from "../plugin-ledger-connector-ethereum";
import OAS from "../../json/openapi.json";
import { InvokeRawWeb3EthContractV1Response } from "../generated/openapi/typescript-axios";
import { ERR_INVALID_RESPONSE } from "web3";
import { isWeb3Error } from "../public-api";

export interface IInvokeRawWeb3EthContractEndpointOptions {
  logLevel?: LogLevelDesc;
  connector: PluginLedgerConnectorEthereum;
}

export class InvokeRawWeb3EthContractEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "InvokeRawWeb3EthContractEndpoint";

  private readonly log: Logger;

  public get className(): string {
    return InvokeRawWeb3EthContractEndpoint.CLASS_NAME;
  }

  constructor(
    public readonly options: IInvokeRawWeb3EthContractEndpointOptions,
  ) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.connector, `${fnTag} arg options.connector`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get oasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-ethereum/invoke-raw-web3eth-contract"] {
    return OAS.paths[
      "/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-ethereum/invoke-raw-web3eth-contract"
    ];
  }

  public getPath(): string {
    return this.oasPath.post["x-hyperledger-cacti"].http.path;
  }

  public getVerbLowerCase(): string {
    return this.oasPath.post["x-hyperledger-cacti"].http.verbLowerCase;
  }

  public getOperationId(): string {
    return this.oasPath.post.operationId;
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

  public async handleRequest(req: Request, res: Response): Promise<void> {
    const reqTag = `${this.getVerbLowerCase()} - ${this.getPath()}`;
    this.log.debug(reqTag);

    try {
      const methodResponse =
        await this.options.connector.invokeRawWeb3EthContract(req.body);
      const response: InvokeRawWeb3EthContractV1Response = {
        status: 200,
        data: methodResponse,
      };
      res.json(response);
    } catch (ex) {
      this.log.error(`Crash while serving ${reqTag}`, ex);

      // Return errors responses from ethereum node as user errors
      if (isWeb3Error(ex) && ex.code === ERR_INVALID_RESPONSE) {
        res.status(400).json({
          message: "Invalid Response Error",
          error: safeStringifyException(ex),
        });
        return;
      }

      res.status(500).json({
        message: "Internal Server Error",
        error: safeStringifyException(ex),
      });
    }
  }
}
