/// <reference types="node" />
import { Server } from "http";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { ApiServer, ICactusApiServerOptions } from "@hyperledger/cactus-cmd-api-server";
import { DefaultApi as FabricApi } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import { HealthCareAppDummyInfrastructure } from "./infrastructure/infrastructure";
export interface IHealthCareApp {
    apiHost: string;
    apiServer1Port: number;
    apiServer2Port: number;
    logLevel?: LogLevelDesc;
    apiServerOptions?: ICactusApiServerOptions;
    disableSignalHandlers?: true;
}
export type ShutdownHook = () => Promise<void>;
export declare class HealthCareApp {
    readonly options: IHealthCareApp;
    private readonly log;
    private readonly shutdownHooks;
    readonly infrastructure: HealthCareAppDummyInfrastructure;
    constructor(options: IHealthCareApp);
    start(): Promise<IStartInfo>;
    stop(): Promise<void>;
    onShutdown(hook: ShutdownHook): void;
    startNode(httpServerApi: Server, pluginRegistry: PluginRegistry): Promise<ApiServer>;
}
export interface IStartInfo {
    readonly apiServer1: ApiServer;
    readonly apiServer2: ApiServer;
    readonly fabricApiClient1: FabricApi;
    readonly fabricApiClient2: FabricApi;
}
