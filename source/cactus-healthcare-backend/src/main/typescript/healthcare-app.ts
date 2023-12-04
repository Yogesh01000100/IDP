/* eslint-disable prettier/prettier */
import { AddressInfo } from "net";
import { v4 as uuidv4 } from "uuid";
import { Server } from "http";
import exitHook, { IAsyncExitHookDoneCallback } from "async-exit-hook";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { LogLevelDesc, Logger, LoggerProvider, Servers } from "@hyperledger/cactus-common";
import { ApiServer, AuthorizationProtocol, ConfigService, ICactusApiServerOptions } from "@hyperledger/cactus-cmd-api-server";
import { Configuration, DefaultApi as FabricApi } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import { HealthCareAppDummyInfrastructure, org1Env, org2Env } from "./infrastructure/infrastructure";
import CryptoMaterial from "../../crypto-material/crypto-material.json";
import { HealthCareCactusPlugin } from "../../../../cactus-healthcare-business-logic-plugin";

export interface IHealthCareApp {
  apiHost: string;
  apiServer1Port: number;
  apiServer2Port: number;
  logLevel?: LogLevelDesc;
  apiServerOptions?: ICactusApiServerOptions;
  disableSignalHandlers?: true;
}

export type ShutdownHook = () => Promise<void>;

export class HealthCareApp {
  private readonly log: Logger;
  private readonly shutdownHooks: ShutdownHook[];
  readonly infrastructure: HealthCareAppDummyInfrastructure;

  public constructor(public readonly options: IHealthCareApp) {
    const fnTag = "HealthCareApp#constructor()";
    if (!options) {
      throw new Error(`${fnTag} options parameter is falsy`);
    }
    const { logLevel } = options;

    const level = logLevel || "INFO";
    const label = "healthcare-app";
    this.log = LoggerProvider.getOrCreate({ level, label });

    this.shutdownHooks = [];

    this.infrastructure = new HealthCareAppDummyInfrastructure({
      logLevel: level,
    });
  }

  public async start(): Promise<IStartInfo> {
    this.log.debug(`Starting HealthCare App...`);

    if (!this.options.disableSignalHandlers) {
      exitHook((callback: IAsyncExitHookDoneCallback) => {
        this.stop().then(callback);
      });
      this.log.debug(`Registered signal handlers for graceful auto-shutdown`);
    }

    await this.infrastructure.start();
    this.onShutdown(() => this.infrastructure.stop());


    const fabricPlugin1 = await this.infrastructure.createFabric1LedgerConnector();

    const fabricPlugin2 = await this.infrastructure.createFabric2LedgerConnector();


    // Reserve the ports where the API Servers will run
    const httpApiA = await Servers.startOnPort(this.options.apiServer1Port, this.options.apiHost);
    const httpApiB = await Servers.startOnPort(this.options.apiServer2Port, this.options.apiHost);

    const addressInfoA = httpApiA.address() as AddressInfo;
    const addressInfoB = httpApiB.address() as AddressInfo;
    const nodeApiHostA = `http://${this.options.apiHost}:${addressInfoA.port}`;
    const nodeApiHostB = `http://${this.options.apiHost}:${addressInfoB.port}`;

    const fabricApiClient1 = new FabricApi(new Configuration({ basePath: nodeApiHostA }));
    const fabricApiClient2 = new FabricApi(new Configuration({ basePath: nodeApiHostB }));
   
    const FabricRegistry1 = new PluginRegistry({
      plugins: [
        new PluginKeychainMemory({
          keychainId: CryptoMaterial.keychains.keychain1.id,
          instanceId: uuidv4(),
          logLevel: "INFO",
        }),
        fabricPlugin1,
        new HealthCareCactusPlugin({
          logLevel: "INFO",
          instanceId: uuidv4(),
          fabricApiClient1,  
          fabricApiClient2
          //fabricEnvironment: org1Env,
        }),
      ],
    });

    const FabricRegistry2 = new PluginRegistry({
      plugins: [
        new PluginKeychainMemory({
          keychainId: CryptoMaterial.keychains.keychain2.id,
          instanceId: uuidv4(),
          logLevel: "INFO",
        }),
        fabricPlugin2,// possible cause of problem
        new HealthCareCactusPlugin({
          logLevel: "INFO",
          instanceId: uuidv4(),
          fabricApiClient1,
          fabricApiClient2
          //fabricEnvironment: org2Env,
        }),
      ],
    });

    const apiServer1 = await this.startNode(httpApiA, FabricRegistry1);
    const apiServer2 = await this.startNode(httpApiB, FabricRegistry2);

    this.log.info("Deploying chaincode...");

    await this.infrastructure.deployFabricContract1(fabricApiClient1);
    //await this.infrastructure.deployFabricContract2(fabricApiClient2);

    this.log.info(`Chaincode deployed!!`);

    return {
      apiServer1,
      apiServer2,
      fabricApiClient1,
      fabricApiClient2,
    };
  }

  public async stop(): Promise<void> {
    for (const hook of this.shutdownHooks) {
      await hook();
    }
  }

  public onShutdown(hook: ShutdownHook): void {
    this.shutdownHooks.push(hook);
  }

  public async startNode(httpServerApi: Server, pluginRegistry: PluginRegistry): Promise<ApiServer> {
    this.log.info(`Starting API Server node...`);

    const addressInfoApi = httpServerApi.address() as AddressInfo;
    const configService = new ConfigService();
    const convictConfig = await configService.getOrCreate();
    const config = convictConfig.getProperties();
    config.configFile = "";
    config.apiCorsDomainCsv = `http://${process.env.API_HOST_FRONTEND}:${process.env.API_PORT_FRONTEND}`;
    config.cockpitCorsDomainCsv = `http://${process.env.API_HOST_FRONTEND}:${process.env.API_PORT_FRONTEND}`;
    config.apiPort = addressInfoApi.port;
    config.apiHost = addressInfoApi.address;
    config.grpcPort = 0;
    config.logLevel = this.options.logLevel || "INFO";
    config.authorizationProtocol = AuthorizationProtocol.NONE;

    const apiServer = new ApiServer({
      config,
      httpServerApi,
      pluginRegistry,
    });

    this.onShutdown(() => apiServer.shutdown());
    await apiServer.start();

    return apiServer;
  }
}

export interface IStartInfo {
  readonly apiServer1: ApiServer;
  readonly apiServer2: ApiServer;
  readonly fabricApiClient1: FabricApi;
  readonly fabricApiClient2: FabricApi;
}
