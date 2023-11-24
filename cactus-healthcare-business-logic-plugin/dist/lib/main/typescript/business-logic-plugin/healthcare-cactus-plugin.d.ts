/// <reference types="node" />
import { Express } from "express";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { ICactusPlugin, IPluginWebService, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { DefaultApi as FabricApi } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
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
export declare class HealthCareCactusPlugin implements ICactusPlugin, IPluginWebService {
    readonly options: IHealthCareCactusPluginOptions;
    static readonly CLASS_NAME = "HealthCareCactusPlugin";
    private readonly log;
    private readonly instanceId;
    private endpoints;
    get className(): string;
    constructor(options: IHealthCareCactusPluginOptions);
    getOpenApiSpec(): unknown;
    registerWebServices(app: Express): Promise<IWebServiceEndpoint[]>;
    getOrCreateWebServices(): Promise<IWebServiceEndpoint[]>;
    shutdown(): Promise<void>;
    getInstanceId(): string;
    getPackageName(): string;
    onPluginInit(): Promise<unknown>;
}
