"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCareApp = void 0;
const uuid_1 = require("uuid");
const async_exit_hook_1 = __importDefault(require("async-exit-hook"));
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_cmd_api_server_1 = require("@hyperledger/cactus-cmd-api-server");
const cactus_plugin_ledger_connector_fabric_1 = require("@hyperledger/cactus-plugin-ledger-connector-fabric");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const infrastructure_1 = require("./infrastructure/infrastructure");
const crypto_material_json_1 = __importDefault(require("../../crypto-material/crypto-material.json"));
const cactus_healthcare_business_logic_plugin_1 = require("../../../../../cactus-healthcare-business-logic-plugin");
class HealthCareApp {
    constructor(options) {
        this.options = options;
        const fnTag = "HealthCareApp#constructor()";
        if (!options) {
            throw new Error(`${fnTag} options parameter is falsy`);
        }
        const { logLevel } = options;
        const level = logLevel || "INFO";
        const label = "healthcare-app";
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
        this.shutdownHooks = [];
        this.infrastructure = new infrastructure_1.HealthCareAppDummyInfrastructure({
            logLevel: level,
        });
    }
    async start() {
        this.log.debug(`Starting HealthCare App...`);
        if (!this.options.disableSignalHandlers) {
            (0, async_exit_hook_1.default)((callback) => {
                this.stop().then(callback);
            });
            this.log.debug(`Registered signal handlers for graceful auto-shutdown`);
        }
        await this.infrastructure.start();
        this.onShutdown(() => this.infrastructure.stop());
        const fabricPlugin1 = await this.infrastructure.createFabric1LedgerConnector(); // find this function: createFabric1LedgerConnector
        const fabricPlugin2 = await this.infrastructure.createFabric2LedgerConnector();
        // Reserve the ports where the API Servers will run
        const httpApiA = await cactus_common_1.Servers.startOnPort(this.options.apiServer1Port, this.options.apiHost);
        const httpApiB = await cactus_common_1.Servers.startOnPort(this.options.apiServer2Port, this.options.apiHost);
        const addressInfoA = httpApiA.address();
        const addressInfoB = httpApiB.address();
        const nodeApiHostA = `http://${this.options.apiHost}:${addressInfoA.port}`;
        const nodeApiHostB = `http://${this.options.apiHost}:${addressInfoB.port}`;
        const fabricApiClient1 = new cactus_plugin_ledger_connector_fabric_1.DefaultApi(new cactus_plugin_ledger_connector_fabric_1.Configuration({ basePath: nodeApiHostA }));
        const fabricApiClient2 = new cactus_plugin_ledger_connector_fabric_1.DefaultApi(new cactus_plugin_ledger_connector_fabric_1.Configuration({ basePath: nodeApiHostB }));
        this.log.info("Deploying chaincode...");
        // Deploy contracts on both Fabric networks
        await this.infrastructure.deployFabricContract1(fabricApiClient1); // return type mismatch
        await this.infrastructure.deployFabricContract2(fabricApiClient2);
        this.log.info(`Chaincode deployed.`);
        const clientPluginRegistry = new cactus_core_1.PluginRegistry({
            plugins: [
                new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
                    keychainId: crypto_material_json_1.default.keychains.keychain1.id,
                    instanceId: (0, uuid_1.v4)(),
                    logLevel: "INFO",
                }),
                fabricPlugin1,
                new cactus_healthcare_business_logic_plugin_1.HealthCareCactusPlugin({
                    logLevel: "INFO",
                    instanceId: (0, uuid_1.v4)(),
                    fabricApiClient1,
                    fabricApiClient2,
                    fabricEnvironment: infrastructure_1.org1Env,
                }),
            ],
        });
        const serverPluginRegistry = new cactus_core_1.PluginRegistry({
            plugins: [
                new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
                    keychainId: crypto_material_json_1.default.keychains.keychain2.id,
                    instanceId: (0, uuid_1.v4)(),
                    logLevel: "INFO",
                }),
                fabricPlugin2,
                new cactus_healthcare_business_logic_plugin_1.HealthCareCactusPlugin({
                    logLevel: "INFO",
                    instanceId: (0, uuid_1.v4)(),
                    fabricApiClient1,
                    fabricApiClient2,
                    fabricEnvironment: infrastructure_1.org2Env,
                }),
            ],
        });
        const apiServer1 = await this.startNode(httpApiA, clientPluginRegistry);
        const apiServer2 = await this.startNode(httpApiB, serverPluginRegistry);
        return {
            apiServer1,
            apiServer2,
            fabricApiClient1,
            fabricApiClient2,
        };
    }
    async stop() {
        for (const hook of this.shutdownHooks) {
            await hook();
        }
    }
    onShutdown(hook) {
        this.shutdownHooks.push(hook);
    }
    async startNode(httpServerApi, pluginRegistry) {
        this.log.info(`Starting API Server node...`);
        const addressInfoApi = httpServerApi.address();
        const configService = new cactus_cmd_api_server_1.ConfigService();
        const convictConfig = await configService.getOrCreate();
        const config = convictConfig.getProperties();
        config.configFile = "";
        config.apiCorsDomainCsv = `http://${process.env.API_HOST_FRONTEND}:${process.env.API_PORT_FRONTEND}`;
        config.cockpitCorsDomainCsv = `http://${process.env.API_HOST_FRONTEND}:${process.env.API_PORT_FRONTEND}`;
        config.apiPort = addressInfoApi.port;
        config.apiHost = addressInfoApi.address;
        config.grpcPort = 0;
        config.logLevel = this.options.logLevel || "INFO";
        config.authorizationProtocol = cactus_cmd_api_server_1.AuthorizationProtocol.NONE;
        const apiServer = new cactus_cmd_api_server_1.ApiServer({
            config,
            httpServerApi,
            pluginRegistry,
        });
        this.onShutdown(() => apiServer.shutdown());
        await apiServer.start();
        return apiServer;
    }
}
exports.HealthCareApp = HealthCareApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoY2FyZS1hcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2hlYWx0aGNhcmUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLCtCQUFvQztBQUVwQyxzRUFBdUU7QUFDdkUsMERBQTBEO0FBQzFELDhEQUEyRjtBQUMzRiw4RUFBOEg7QUFDOUgsOEdBQTRHO0FBQzVHLDhGQUFrRjtBQUNsRixvRUFBcUc7QUFDckcsc0dBQXdFO0FBQ3hFLGlIQUE2RjtBQWE3RixNQUFhLGFBQWE7SUFLeEIsWUFBbUMsT0FBdUI7UUFBdkIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDeEQsTUFBTSxLQUFLLEdBQUcsNkJBQTZCLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLDZCQUE2QixDQUFDLENBQUM7U0FDeEQ7UUFDRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRTdCLE1BQU0sS0FBSyxHQUFHLFFBQVEsSUFBSSxNQUFNLENBQUM7UUFDakMsTUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRXhELElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBRXhCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxpREFBZ0MsQ0FBQztZQUN6RCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQUs7UUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRTtZ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