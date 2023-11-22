import OAS from "../../json/openapi.json";// to be done


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

import { IHealthCareContractDeploymentInfo } from "../i-healthcare-contract-deployment-info";

import { InsertDataEndpoint } from "./web-services/insert-patient-endpoint";
import { ListDataEndpoint } from "./web-services/list-patient-endpoint";


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
  fabricApiClient1: FabricApi;
  fabricApiClient2: FabricApi;
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
    Checks.truthy(options.contracts, `${fnTag} arg options.contracts`); // watch for contract variable
    Checks.truthy(
      options.fabricApiClient1,
      `${fnTag} arg options.fabricApiClient`,
    );
    Checks.truthy(
      options.fabricApiClient2,
      `${fnTag} arg options.fabricApiClient`,
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

    // Endpoints for net 1
    const insertDataOrg1 = new InsertDataEndpoint({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: this.options.contracts.sourceRepository.keychainId,
    });

    const listDataOrg1 = new ListDataEndpoint({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: this.options.contracts.sourceRepository.keychainId,
    });

    // Endpoints for net 2
    const insertDataOrg2 = new InsertDataEndpoint({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: this.options.contracts.destinationRepository.keychainId,
    });

    const listDatatOrg2 = new ListDataEndpoint({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: this.options.destinationRepository.keychainId, // contract variable
    });

    this.endpoints = [
      insertDataOrg1,
      listDataOrg1,
      insertDataOrg2,
      listDatatOrg2,
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
    return "@hyperledger/healthcare-backend";
  }

  public async onPluginInit(): Promise<unknown> {
    return;
  }
}
