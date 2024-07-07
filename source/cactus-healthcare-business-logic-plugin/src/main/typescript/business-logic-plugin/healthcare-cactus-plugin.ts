import OAS from "../../json/openapi.json";


import { Express } from "express";

import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import {
  ICactusPlugin,
  IPluginWebService,
  IWebServiceEndpoint,
} from "@hyperledger/cactus-core-api";

import { DefaultApi as FabricApi } from "@hyperledger/cactus-plugin-ledger-connector-fabric";

//import { IHealthCareContractDeploymentInfo } from "../i-healthcare-contract-deployment-info";


import { GetMyProfilePatientA } from "./web-services/get-my-profile-patient-hspa";
import { GetMyProfilePatientB } from "./web-services/get-my-profile-patient-hspb";

import CryptoMaterial from "../../../crypto-material/crypto-material.json";

export interface OrgEnv {
  CORE_PEER_LOCALMSPID: string;
  CORE_PEER_ADDRESS: string;
  CORE_PEER_MSPCONFIGPATH: string;
  CORE_PEER_TLS_ROOTCERT_FILE: string;
  ORDERER_TLS_ROOTCERT_FILE: string;
}

export interface IHealthCareCactusPluginOptions {
  logLevel?: LogLevelDesc;
  instanceId: string;
  fabricApiClient: FabricApi;
  fabricEnvironment?: NodeJS.ProcessEnv;
}

export class HealthCareCactusPlugin
  implements ICactusPlugin, IPluginWebService
{
  public static readonly CLASS_NAME = "HealthCareCactusPlugin";

  private readonly log: Logger;
  private readonly instanceId: string;

  private endpoints: IWebServiceEndpoint[] | undefined;

  public get className(): string {
    return HealthCareCactusPlugin.CLASS_NAME;
  }

  constructor(public readonly options: IHealthCareCactusPluginOptions) {
    const fnTag = `${this.className}#constructor`;

    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.instanceId, `${fnTag} arg options.instanceId`);
    Checks.nonBlankString(options.instanceId, `${fnTag} options.instanceId`);
    Checks.truthy(
      options.fabricApiClient,
      `${fnTag} arg options.fabricApiClient1`,
    );
    Checks.truthy(
      options.fabricApiClient,
      `${fnTag} arg options.fabricApiClient2`,
    );

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
    this.instanceId = options.instanceId;
  }

  public getOpenApiSpec(): unknown {
    return OAS;
  }

  async registerWebServices(app: Express): Promise<IWebServiceEndpoint[]> {
    const webServices = await this.getOrCreateWebServices();
    await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
    return webServices;
  }

  public async getOrCreateWebServices(): Promise<IWebServiceEndpoint[]> {
    if (Array.isArray(this.endpoints)) {
      return this.endpoints;
    }  

    // Endpoints for network 1
    const getMyProfilePatientNet1  = new GetMyProfilePatientA({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });

    // Endpoints for network 2
    const getMyProfilePatientNet2  = new GetMyProfilePatientB({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });

    this.endpoints = [
      getMyProfilePatientNet1,
      getMyProfilePatientNet2
    ];

    return this.endpoints;
  }

  public async shutdown(): Promise<void> {
    this.log.info(`Shutting down ${this.className}...`);
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public getPackageName(): string {
    return "@hyperledger/cactus-healthcare-bussiness-logic-plugin";
  }

  public async onPluginInit(): Promise<unknown> {
    return;
  }
}
