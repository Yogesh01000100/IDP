"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCareAppDummyInfrastructure = exports.org2Env = exports.org1Env = void 0;
/* eslint-disable prettier/prettier */
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_extra_1 = __importDefault(require("fs-extra"));
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const cactus_plugin_ledger_connector_fabric_1 = require("@hyperledger/cactus-plugin-ledger-connector-fabric");
const cactus_core_1 = require("@hyperledger/cactus-core");
const crypto_material_json_1 = __importDefault(require("../../../crypto-material/crypto-material.json"));
exports.org1Env = {
    CORE_PEER_LOCALMSPID: "Org1MSP",
    CORE_PEER_ADDRESS: "peer0.org1.example.com:7051",
    CORE_PEER_MSPCONFIGPATH: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp",
    CORE_PEER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt",
    ORDERER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
};
exports.org2Env = {
    CORE_PEER_LOCALMSPID: "Org1MSP",
    CORE_PEER_ADDRESS: "peer0.org1.example.com:9051",
    CORE_PEER_MSPCONFIGPATH: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp",
    CORE_PEER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt",
    ORDERER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
};
class HealthCareAppDummyInfrastructure {
    get orgCfgDir() {
        return HealthCareAppDummyInfrastructure.FABRIC_2_AIO_CLI_CFG_DIR;
    }
    constructor(options) {
        this.options = options;
        const fnTag = `HealthCareAppDummyInfrastructure#constructor()`;
        cactus_common_1.Checks.truthy(options, `${fnTag} arg options`);
        const level = this.options.logLevel || "INFO";
        const label = "HealthCareAppDummyInfrastructure";
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
        this.fabric1 = new cactus_test_tooling_1.FabricTestLedgerV1({
            publishAllPorts: true,
            imageName: cactus_test_tooling_1.DEFAULT_FABRIC_2_AIO_IMAGE_NAME,
            imageVersion: cactus_test_tooling_1.DEFAULT_FABRIC_2_AIO_IMAGE_VERSION,
            envVars: new Map([
                ["FABRIC_VERSION", cactus_test_tooling_1.DEFAULT_FABRIC_2_AIO_FABRIC_VERSION],
            ]),
            logLevel: level || "DEBUG",
        });
        this.fabric2 = new cactus_test_tooling_1.FabricTestLedgerV2({
            publishAllPorts: true,
            imageName: cactus_test_tooling_1.DEFAULT_FABRIC_2_AIO_IMAGE_NAME_V2,
            imageVersion: cactus_test_tooling_1.DEFAULT_FABRIC_2_AIO_IMAGE_VERSION_V2,
            envVars: new Map([
                ["FABRIC_VERSION", cactus_test_tooling_1.DEFAULT_FABRIC_2_AIO_FABRIC_VERSION_V2],
            ]),
            logLevel: level || "DEBUG",
        });
    }
    get org1Env() {
        return {
            CORE_LOGGING_LEVEL: "debug",
            FABRIC_LOGGING_SPEC: "debug",
            CORE_PEER_LOCALMSPID: "Org1MSP",
            ORDERER_CA: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
            FABRIC_CFG_PATH: "/etc/hyperledger/fabric",
            CORE_PEER_TLS_ENABLED: "true",
            CORE_PEER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt`,
            CORE_PEER_MSPCONFIGPATH: `${this.orgCfgDir}peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp`,
            CORE_PEER_ADDRESS: "peer0.org1.example.com:7051",
            ORDERER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
        };
    }
    get org2Env() {
        return {
            CORE_LOGGING_LEVEL: "debug",
            FABRIC_LOGGING_SPEC: "debug",
            CORE_PEER_LOCALMSPID: "Org2MSP",
            FABRIC_CFG_PATH: "/etc/hyperledger/fabric",
            CORE_PEER_TLS_ENABLED: "true",
            ORDERER_CA: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
            CORE_PEER_ADDRESS: "peer0.org2.example.com:9051",
            CORE_PEER_MSPCONFIGPATH: `${this.orgCfgDir}peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp`,
            CORE_PEER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt`,
            ORDERER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
        };
    }
    async start() {
        try {
            this.log.info(`Starting dummy infrastructure...`);
            await Promise.all([
                this.fabric1.start(),
                this.fabric2.start(),
            ]);
            this.log.info(`Started dummy infrastructure OK`);
        }
        catch (ex) {
            this.log.error(`Starting of dummy infrastructure crashed: `, ex);
            throw ex;
        }
    }
    async stop() {
        try {
            this.log.info(`Stopping...`);
            await Promise.all([
                this.fabric1.stop().then(() => this.fabric1.destroy()),
                this.fabric2.stop().then(() => this.fabric2.destroy()),
            ]);
            this.log.info(`Stopped OK`);
        }
        catch (ex) {
            this.log.error(`Stopping crashed: `, ex);
            throw ex;
        }
    }
    // Example method: Creating a ledger connector for the first Fabric network
    async createFabric1LedgerConnector() {
        const connectionProfileOrg1 = await this.fabric1.getConnectionProfileOrg1();
        const enrollAdminOutOrg1 = await this.fabric1.enrollAdminV2({
            organization: "org1",
        });
        const adminWalletOrg1 = enrollAdminOutOrg1[1];
        const [userIdentity1] = await this.fabric1.enrollUserV2({
            wallet: adminWalletOrg1,
            enrollmentID: "userA",
            organization: "org1",
        });
        const [userIdentity2] = await this.fabric1.enrollUserV2({
            wallet: adminWalletOrg1,
            enrollmentID: "userB",
            organization: "org1",
        });
        const enrollAdminOutOrg2 = await this.fabric1.enrollAdminV2({
            organization: "org2",
        });
        const adminWalletOrg2 = enrollAdminOutOrg2[1];
        const [bridgeIdentity] = await this.fabric1.enrollUserV2({
            wallet: adminWalletOrg2,
            enrollmentID: "bridge",
            organization: "org2",
        });
        const sshConfig = await this.fabric1.getSshConfig();
        const keychainEntryKey1 = "userA";
        const keychainEntryValue1 = JSON.stringify(userIdentity1);
        const keychainEntryKey2 = "userB";
        const keychainEntryValue2 = JSON.stringify(userIdentity2);
        const keychainEntryKey3 = "bridge";
        const keychainEntryValue3 = JSON.stringify(bridgeIdentity);
        const keychainPlugin = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
            instanceId: (0, uuid_1.v4)(),
            keychainId: crypto_material_json_1.default.keychains.keychain1.id,
            logLevel: undefined,
            backend: new Map([
                [keychainEntryKey1, keychainEntryValue1],
                [keychainEntryKey2, keychainEntryValue2],
                [keychainEntryKey3, keychainEntryValue3],
            ]),
        });
        const pluginRegistry = new cactus_core_1.PluginRegistry({ plugins: [keychainPlugin] });
        this.log.info(`Creating Fabric Connector...`);
        return new cactus_plugin_ledger_connector_fabric_1.PluginLedgerConnectorFabric({
            instanceId: (0, uuid_1.v4)(),
            dockerBinary: "/usr/local/bin/docker",
            peerBinary: "/fabric-samples/bin/peer",
            goBinary: "/usr/local/go/bin/go",
            pluginRegistry,
            cliContainerEnv: this.org1Env,
            sshConfig,
            connectionProfile: connectionProfileOrg1,
            logLevel: this.options.logLevel || "INFO",
            discoveryOptions: {
                enabled: true,
                asLocalhost: true,
            },
            eventHandlerOptions: {
                strategy: cactus_plugin_ledger_connector_fabric_1.DefaultEventHandlerStrategy.NetworkScopeAllfortx,
                commitTimeout: 300,
            },
        });
    }
    // Example method: Creating a ledger connector for the second Fabric network
    async createFabric2LedgerConnector() {
        const connectionProfileOrg1 = await this.fabric2.getConnectionProfileOrg1();
        const enrollAdminOutOrg1 = await this.fabric2.enrollAdminV2({
            organization: "org1",
        });
        const adminWalletOrg1 = enrollAdminOutOrg1[1];
        const [userIdentity1] = await this.fabric2.enrollUserV2({
            wallet: adminWalletOrg1,
            enrollmentID: "userA",
            organization: "org1",
        });
        const [userIdentity2] = await this.fabric2.enrollUserV2({
            wallet: adminWalletOrg1,
            enrollmentID: "userB",
            organization: "org1",
        });
        const enrollAdminOutOrg2 = await this.fabric2.enrollAdminV2({
            organization: "org2",
        });
        const adminWalletOrg2 = enrollAdminOutOrg2[1];
        const [bridgeIdentity] = await this.fabric2.enrollUserV2({
            wallet: adminWalletOrg2,
            enrollmentID: "bridge",
            organization: "org2",
        });
        const sshConfig = await this.fabric2.getSshConfig();
        const keychainEntryKey1 = "userA";
        const keychainEntryValue1 = JSON.stringify(userIdentity1);
        const keychainEntryKey2 = "userB";
        const keychainEntryValue2 = JSON.stringify(userIdentity2);
        const keychainEntryKey3 = "bridge";
        const keychainEntryValue3 = JSON.stringify(bridgeIdentity);
        const keychainPlugin = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
            instanceId: (0, uuid_1.v4)(),
            keychainId: crypto_material_json_1.default.keychains.keychain1.id,
            logLevel: undefined,
            backend: new Map([
                [keychainEntryKey1, keychainEntryValue1],
                [keychainEntryKey2, keychainEntryValue2],
                [keychainEntryKey3, keychainEntryValue3],
            ]),
        });
        const pluginRegistry = new cactus_core_1.PluginRegistry({ plugins: [keychainPlugin] });
        this.log.info(`Creating Fabric Connector...`);
        return new cactus_plugin_ledger_connector_fabric_1.PluginLedgerConnectorFabric({
            instanceId: (0, uuid_1.v4)(),
            dockerBinary: "/usr/local/bin/docker",
            peerBinary: "/fabric-samples/bin/peer",
            goBinary: "/usr/local/go/bin/go",
            pluginRegistry,
            cliContainerEnv: this.org1Env,
            sshConfig,
            connectionProfile: connectionProfileOrg1,
            logLevel: this.options.logLevel || "INFO",
            discoveryOptions: {
                enabled: true,
                asLocalhost: true,
            },
            eventHandlerOptions: {
                strategy: cactus_plugin_ledger_connector_fabric_1.DefaultEventHandlerStrategy.NetworkScopeAllfortx,
                commitTimeout: 300,
            },
        });
    }
    // smart contract deployment in fabric network
    async deployFabricContract1(fabricApiClient) {
        const channelId = "mychannel";
        const channelName = channelId;
        const contractName = "EHRContract";
        const contractRelPath = "../../../fabric-contracts/contracts/typescript";
        const contractDir = path_1.default.join(__dirname, contractRelPath);
        // ├── package.json
        // ├── index.js
        // ├── lib
        // │   ├── tokenERC20.js
        const sourceFiles = [];
        {
            const filename = "./package.json";
            const relativePath = "./";
            const filePath = path_1.default.join(contractDir, relativePath, filename);
            const buffer = await fs_extra_1.default.readFile(filePath);
            sourceFiles.push({
                body: buffer.toString("base64"),
                filepath: relativePath,
                filename,
            });
        }
        {
            const filename = "./index.js";
            const relativePath = "./";
            const filePath = path_1.default.join(contractDir, relativePath, filename);
            const buffer = await fs_extra_1.default.readFile(filePath);
            sourceFiles.push({
                body: buffer.toString("base64"),
                filepath: relativePath,
                filename,
            });
        }
        {
            const filename = "./crypto-material.json";
            const relativePath = "./crypto-material/";
            const filePath = path_1.default.join(contractDir, relativePath, filename);
            const buffer = await fs_extra_1.default.readFile(filePath);
            sourceFiles.push({
                body: buffer.toString("base64"),
                filepath: relativePath,
                filename,
            });
        }
        let retries = 0;
        while (retries <= 5) {
            await fabricApiClient
                .deployContractV1({
                channelId,
                ccVersion: "1.0.0",
                sourceFiles,
                ccName: contractName,
                targetOrganizations: [this.org1Env, this.org2Env],
                caFile: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
                ccLabel: "cbdc",
                ccLang: cactus_plugin_ledger_connector_fabric_1.ChainCodeProgrammingLanguage.Javascript,
                ccSequence: 1,
                orderer: "orderer.example.com:7050",
                ordererTLSHostnameOverride: "orderer.example.com",
                connTimeout: 120,
            }, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            })
                .then(async (res) => {
                retries = 6;
                const { packageIds, lifecycle } = res.data;
                const { approveForMyOrgList, installList, queryInstalledList, commit, packaging, queryCommitted, } = lifecycle;
                cactus_common_1.Checks.truthy(packageIds, `packageIds truthy OK`);
                cactus_common_1.Checks.truthy(Array.isArray(packageIds), `Array.isArray(packageIds) truthy OK`);
                cactus_common_1.Checks.truthy(approveForMyOrgList, `approveForMyOrgList truthy OK`);
                cactus_common_1.Checks.truthy(Array.isArray(approveForMyOrgList), `Array.isArray(approveForMyOrgList) truthy OK`);
                cactus_common_1.Checks.truthy(installList, `installList truthy OK`);
                cactus_common_1.Checks.truthy(Array.isArray(installList), `Array.isArray(installList) truthy OK`);
                cactus_common_1.Checks.truthy(queryInstalledList, `queryInstalledList truthy OK`);
                cactus_common_1.Checks.truthy(Array.isArray(queryInstalledList), `Array.isArray(queryInstalledList) truthy OK`);
                cactus_common_1.Checks.truthy(commit, `commit truthy OK`);
                cactus_common_1.Checks.truthy(packaging, `packaging truthy OK`);
                cactus_common_1.Checks.truthy(queryCommitted, `queryCommitted truthy OK`);
                // FIXME - without this wait it randomly fails with an error claiming that
                // the endorsement was impossible to be obtained. The fabric-samples script
                // does the same thing, it just waits 10 seconds for good measure so there
                // might not be a way for us to avoid doing this, but if there is a way we
                // absolutely should not have timeouts like this, anywhere...
                await new Promise((resolve) => setTimeout(resolve, 10000));
                await fabricApiClient.runTransactionV1({
                    contractName,
                    channelName,
                    params: ["name1", "symbol1", "8"],
                    methodName: "Initialize",
                    invocationType: cactus_plugin_ledger_connector_fabric_1.FabricContractInvocationType.Send,
                    signingCredential: {
                        keychainId: crypto_material_json_1.default.keychains.keychain1.id,
                        keychainRef: "userA",
                    },
                });
                this.log.info(`Deployed chaincode on 1st fabric OK`);
            })
                .catch(() => console.log("trying to deploy fabric contract again"));
            retries++;
        }
    }
    async deployFabricContract2(fabricApiClient) {
        const channelId = "mychannel";
        const channelName = channelId;
        const contractName = "EHRContract";
        const contractRelPath = "../../../fabric-contracts/contracts/typescript";
        const contractDir = path_1.default.join(__dirname, contractRelPath);
        // ├── package.json
        // ├── index.js
        // ├── lib
        // │   ├── tokenERC20.js
        const sourceFiles = [];
        {
            const filename = "./package.json";
            const relativePath = "./";
            const filePath = path_1.default.join(contractDir, relativePath, filename);
            const buffer = await fs_extra_1.default.readFile(filePath);
            sourceFiles.push({
                body: buffer.toString("base64"),
                filepath: relativePath,
                filename,
            });
        }
        {
            const filename = "./index.js";
            const relativePath = "./";
            const filePath = path_1.default.join(contractDir, relativePath, filename);
            const buffer = await fs_extra_1.default.readFile(filePath);
            sourceFiles.push({
                body: buffer.toString("base64"),
                filepath: relativePath,
                filename,
            });
        }
        {
            const filename = "./crypto-material.json";
            const relativePath = "./crypto-material/";
            const filePath = path_1.default.join(contractDir, relativePath, filename);
            const buffer = await fs_extra_1.default.readFile(filePath);
            sourceFiles.push({
                body: buffer.toString("base64"),
                filepath: relativePath,
                filename,
            });
        }
        let retries = 0;
        while (retries <= 5) {
            await fabricApiClient
                .deployContractV1({
                channelId,
                ccVersion: "1.0.0",
                sourceFiles,
                ccName: contractName,
                targetOrganizations: [this.org1Env, this.org2Env],
                caFile: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
                ccLabel: "cbdc",
                ccLang: cactus_plugin_ledger_connector_fabric_1.ChainCodeProgrammingLanguage.Javascript,
                ccSequence: 1,
                orderer: "orderer.example.com:7051",
                ordererTLSHostnameOverride: "orderer.example.com",
                connTimeout: 120,
            }, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            })
                .then(async (res) => {
                retries = 6;
                const { packageIds, lifecycle } = res.data;
                const { approveForMyOrgList, installList, queryInstalledList, commit, packaging, queryCommitted, } = lifecycle;
                cactus_common_1.Checks.truthy(packageIds, `packageIds truthy OK`);
                cactus_common_1.Checks.truthy(Array.isArray(packageIds), `Array.isArray(packageIds) truthy OK`);
                cactus_common_1.Checks.truthy(approveForMyOrgList, `approveForMyOrgList truthy OK`);
                cactus_common_1.Checks.truthy(Array.isArray(approveForMyOrgList), `Array.isArray(approveForMyOrgList) truthy OK`);
                cactus_common_1.Checks.truthy(installList, `installList truthy OK`);
                cactus_common_1.Checks.truthy(Array.isArray(installList), `Array.isArray(installList) truthy OK`);
                cactus_common_1.Checks.truthy(queryInstalledList, `queryInstalledList truthy OK`);
                cactus_common_1.Checks.truthy(Array.isArray(queryInstalledList), `Array.isArray(queryInstalledList) truthy OK`);
                cactus_common_1.Checks.truthy(commit, `commit truthy OK`);
                cactus_common_1.Checks.truthy(packaging, `packaging truthy OK`);
                cactus_common_1.Checks.truthy(queryCommitted, `queryCommitted truthy OK`);
                // FIXME - without this wait it randomly fails with an error claiming that
                // the endorsement was impossible to be obtained. The fabric-samples script
                // does the same thing, it just waits 10 seconds for good measure so there
                // might not be a way for us to avoid doing this, but if there is a way we
                // absolutely should not have timeouts like this, anywhere...
                await new Promise((resolve) => setTimeout(resolve, 10000));
                await fabricApiClient.runTransactionV1({
                    contractName,
                    channelName,
                    params: ["name1", "symbol1", "8"],
                    methodName: "Initialize",
                    invocationType: cactus_plugin_ledger_connector_fabric_1.FabricContractInvocationType.Send,
                    signingCredential: {
                        keychainId: crypto_material_json_1.default.keychains.keychain1.id,
                        keychainRef: "userA",
                    },
                });
                this.log.info(`Deployed chaincode on 2nd fabric network OK`);
            })
                .catch(() => console.log("trying to deploy fabric contract again"));
            retries++;
        }
    }
}
exports.HealthCareAppDummyInfrastructure = HealthCareAppDummyInfrastructure;
HealthCareAppDummyInfrastructure.FABRIC_2_AIO_CLI_CFG_DIR = "/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmFzdHJ1Y3R1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2luZnJhc3RydWN0dXJlL2luZnJhc3RydWN0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNDQUFzQztBQUN0QyxnREFBd0I7QUFDeEIsK0JBQW9DO0FBQ3BDLHdEQUEwQjtBQUMxQiw4REFBMEY7QUFDMUYsMEVBUTBDO0FBQzFDLDhGQUFrRjtBQUNsRiw4R0FBNFA7QUFDNVAsMERBQTBEO0FBQzFELHlHQUEyRTtBQUU5RCxRQUFBLE9BQU8sR0FBRTtJQUNwQixvQkFBb0IsRUFBRSxTQUFTO0lBQy9CLGlCQUFpQixFQUFFLDZCQUE2QjtJQUNoRCx1QkFBdUIsRUFDckIsK0hBQStIO0lBQ2pJLDJCQUEyQixFQUN6QixzSUFBc0k7SUFDeEkseUJBQXlCLEVBQ3ZCLG1LQUFtSztDQUN0SyxDQUFDO0FBRVcsUUFBQSxPQUFPLEdBQUU7SUFDcEIsb0JBQW9CLEVBQUUsU0FBUztJQUMvQixpQkFBaUIsRUFBRSw2QkFBNkI7SUFDaEQsdUJBQXVCLEVBQ3JCLCtIQUErSDtJQUNqSSwyQkFBMkIsRUFDekIsc0lBQXNJO0lBQ3hJLHlCQUF5QixFQUN2QixtS0FBbUs7Q0FDdEssQ0FBQztBQU1GLE1BQWEsZ0NBQWdDO0lBTzNDLElBQVcsU0FBUztRQUNsQixPQUFPLGdDQUFnQyxDQUFDLHdCQUF3QixDQUFDO0lBQ25FLENBQUM7SUFFRCxZQUE0QixPQUF5QztRQUF6QyxZQUFPLEdBQVAsT0FBTyxDQUFrQztRQUNuRSxNQUFNLEtBQUssR0FBRyxnREFBZ0QsQ0FBQztRQUMvRCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLGNBQWMsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztRQUM5QyxNQUFN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