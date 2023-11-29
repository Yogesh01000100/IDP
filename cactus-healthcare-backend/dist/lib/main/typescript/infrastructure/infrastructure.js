"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCareAppDummyInfrastructure = exports.org4Env = exports.org3Env = exports.org2Env = exports.org1Env = void 0;
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
// [for fab net -1]
exports.org1Env = {
    CORE_PEER_LOCALMSPID: "Org1MSP",
    CORE_PEER_ADDRESS: "peer0.org1.example.com:7051",
    CORE_PEER_MSPCONFIGPATH: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp",
    CORE_PEER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt",
    ORDERER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
};
exports.org2Env = {
    CORE_PEER_LOCALMSPID: "Org2MSP",
    CORE_PEER_ADDRESS: "peer0.org2.example.com:9051",
    CORE_PEER_MSPCONFIGPATH: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org1.example.com/msp",
    CORE_PEER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt",
    ORDERER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
};
// [for fab net -2] possible errors
exports.org3Env = {
    CORE_PEER_LOCALMSPID: "Org1MSP",
    CORE_PEER_ADDRESS: "peer0.org1.example.com:8001",
    CORE_PEER_MSPCONFIGPATH: "/home/yogesh/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp",
    CORE_PEER_TLS_ROOTCERT_FILE: "/home/yogesh/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt",
    ORDERER_TLS_ROOTCERT_FILE: "/home/yogesh/fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
};
exports.org4Env = {
    CORE_PEER_LOCALMSPID: "Org2MSP",
    CORE_PEER_ADDRESS: "peer0.org2.example.com:10004",
    CORE_PEER_MSPCONFIGPATH: "/home/yogesh/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp",
    CORE_PEER_TLS_ROOTCERT_FILE: "/home/yogesh/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt",
    ORDERER_TLS_ROOTCERT_FILE: "/home/yogesh/fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
};
class HealthCareAppDummyInfrastructure {
    get className() {
        return HealthCareAppDummyInfrastructure.CLASS_NAME;
    }
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
    get org3Env() {
        return {
            CORE_LOGGING_LEVEL: "debug",
            FABRIC_LOGGING_SPEC: "debug",
            CORE_PEER_LOCALMSPID: "Org1MSP",
            ORDERER_CA: "/home/yogesh/fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
            FABRIC_CFG_PATH: "/home/yogesh/fabric-samples",
            CORE_PEER_TLS_ENABLED: "true",
            CORE_PEER_ADDRESS: "peer0.org1.example.com:8001",
            CORE_PEER_MSPCONFIGPATH: "/home/yogesh/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp",
            CORE_PEER_TLS_ROOTCERT_FILE: "/home/yogesh/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt",
            ORDERER_TLS_ROOTCERT_FILE: "/home/yogesh/fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
        };
    }
    get org4Env() {
        return {
            CORE_LOGGING_LEVEL: "debug",
            FABRIC_LOGGING_SPEC: "debug",
            CORE_PEER_LOCALMSPID: "Org2MSP",
            FABRIC_CFG_PATH: "/home/yogesh/fabric-samples",
            CORE_PEER_TLS_ENABLED: "true",
            ORDERER_CA: "/home/yogesh/fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
            CORE_PEER_ADDRESS: "peer0.org2.example.com:10004",
            CORE_PEER_MSPCONFIGPATH: "/home/yogesh/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp",
            CORE_PEER_TLS_ROOTCERT_FILE: "/home/yogesh/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt",
            ORDERER_TLS_ROOTCERT_FILE: "/home/yogesh/fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
        };
    }
    async start() {
        try {
            this.log.info(`Starting Healthcare infrastructure...`);
            await Promise.all([
                this.fabric1.start()
            ]);
            this.log.info(`Started Healthcare infrastructure OK`);
        }
        catch (ex) {
            this.log.error(`Starting of Healthcare infrastructure crashed: `, ex);
            throw ex;
        }
    }
    async stop() {
        try {
            this.log.info(`Stopping...`);
            await Promise.all([
                this.fabric1.stop().then(() => this.fabric1.destroy())
            ]);
            this.log.info(`Stopped OK`);
        }
        catch (ex) {
            this.log.error(`Stopping crashed: `, ex);
            throw ex;
        }
    }
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
        this.log.info(`Creating Fabric Connector 1...`);
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
    // possible errors
    async createFabric2LedgerConnector() {
        const connectionProfileOrg1 = await this.fabric2.getConnectionProfileOrg1();
        const enrollAdminOutOrg1 = await this.fabric2.enrollAdminV2({
            organization: "org1",
        });
        const adminWalletOrg1 = enrollAdminOutOrg1[1];
        const [userIdentity1] = await this.fabric2.enrollUserV2({
            wallet: adminWalletOrg1,
            enrollmentID: "userZ",
            organization: "org1",
        });
        const [userIdentity2] = await this.fabric2.enrollUserV2({
            wallet: adminWalletOrg1,
            enrollmentID: "userC",
            organization: "org1",
        });
        const enrollAdminOutOrg2 = await this.fabric2.enrollAdminV2({
            organization: "org2",
        });
        const adminWalletOrg2 = enrollAdminOutOrg2[1];
        const [bridgeIdentity] = await this.fabric2.enrollUserV2({
            wallet: adminWalletOrg2,
            enrollmentID: "bridge8",
            organization: "org2",
        });
        const sshConfig = await this.fabric2.getSshConfig();
        this.log.info("sshConfig details : ", sshConfig);
        const keychainEntryKey1 = "userZ";
        const keychainEntryValue1 = JSON.stringify(userIdentity1);
        const keychainEntryKey2 = "userC";
        const keychainEntryValue2 = JSON.stringify(userIdentity2);
        const keychainEntryKey3 = "bridge8";
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
        this.log.info(`Creating Fabric Connector 2...`);
        return new cactus_plugin_ledger_connector_fabric_1.PluginLedgerConnectorFabric({
            instanceId: (0, uuid_1.v4)(),
            //dockerBinary: "/usr/local/bin/docker", // done changes
            peerBinary: "/home/yogesh/fabric-samples/bin/peer",
            goBinary: "/usr/bin/go",
            pluginRegistry,
            cliContainerEnv: this.org3Env,
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
    // chaincode deployment in both networks
    async deployFabricContract1(fabricApiClient) {
        this.log.info("Inside deployFabricContract1...");
        const channelId = "mychannel";
        const channelName = channelId;
        const contractName = "EHRContract";
        const contractRelPath = "../../../fabric-contracts/contracts/javascript";
        const contractDir = path_1.default.join(__dirname, contractRelPath);
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
            const filename = "./EHR.js";
            const relativePath = "./lib/";
            const filePath = path_1.default.join(contractDir, relativePath, filename);
            const buffer = await fs_extra_1.default.readFile(filePath);
            sourceFiles.push({
                body: buffer.toString("base64"),
                filepath: relativePath,
                filename,
            });
        }
        this.log.info("File paths navigated...");
        let retries = 0;
        while (retries <= 5) {
            this.log.info("Inside while loop count number :", retries);
            await fabricApiClient
                .deployContractV1({
                channelId,
                ccVersion: "1.0.0",
                sourceFiles,
                ccName: contractName,
                targetOrganizations: [this.org1Env, this.org2Env],
                caFile: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
                ccLabel: "EHRContract",
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
                await new Promise((resolve) => setTimeout(resolve, 10000));
                await fabricApiClient.runTransactionV1({
                    contractName,
                    channelName,
                    params: [],
                    methodName: "InitLedger",
                    invocationType: cactus_plugin_ledger_connector_fabric_1.FabricContractInvocationType.Send,
                    signingCredential: {
                        keychainId: crypto_material_json_1.default.keychains.keychain1.id,
                        keychainRef: "userA",
                    },
                });
            })
                .catch(() => console.log("trying to deploy fabric contract again"));
            retries++;
        }
    }
}
exports.HealthCareAppDummyInfrastructure = HealthCareAppDummyInfrastructure;
HealthCareAppDummyInfrastructure.CLASS_NAME = "HealthCareAppDummyInfrastructure";
HealthCareAppDummyInfrastructure.FABRIC_2_AIO_CLI_CFG_DIR = "/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmFzdHJ1Y3R1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2luZnJhc3RydWN0dXJlL2luZnJhc3RydWN0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNDQUFzQztBQUN0QyxnREFBd0I7QUFDeEIsK0JBQW9DO0FBQ3BDLHdEQUEwQjtBQUMxQiw4REFBMEY7QUFDMUYsMEVBSzBDO0FBQzFDLDhGQUFrRjtBQUNsRiw4R0FBNFA7QUFDNVAsMERBQTBEO0FBQzFELHlHQUEyRTtBQUkzRSxtQkFBbUI7QUFDTixRQUFBLE9BQU8sR0FBRTtJQUNwQixvQkFBb0IsRUFBRSxTQUFTO0lBQy9CLGlCQUFpQixFQUFFLDZCQUE2QjtJQUNoRCx1QkFBdUIsRUFDckIsK0hBQStIO0lBQ2pJLDJCQUEyQixFQUN6QixzSUFBc0k7SUFDeEkseUJBQXlCLEVBQ3ZCLG1LQUFtSztDQUN0SyxDQUFDO0FBQ1csUUFBQSxPQUFPLEdBQUc7SUFDckIsb0JBQW9CLEVBQUUsU0FBUztJQUMvQixpQkFBaUIsRUFBRSw2QkFBNkI7SUFDaEQsdUJBQXVCLEVBQ3JCLCtIQUErSDtJQUNqSSwyQkFBMkIsRUFDekIsc0lBQXNJO0lBQ3hJLHlCQUF5QixFQUN2QixtS0FBbUs7Q0FDdEssQ0FBQztBQUdGLG1DQUFtQztBQUN0QixRQUFBLE9BQU8sR0FBRztJQUNyQixvQkFBb0IsRUFBRSxTQUFTO0lBQy9CLGlCQUFpQixFQUFFLDZCQUE2QjtJQUNoRCx1QkFBdUIsRUFBRSw0SEFBNEg7SUFDckosMkJBQTJCLEVBQUUsbUlBQW1JO0lBQ2hLLHlCQUF5QixFQUFFLGdLQUFnSztDQUM1TCxDQUFDO0FBRVcsUUFBQSxPQUFPLEdBQUc7SUFDckIsb0JBQW9CLEVBQUUsU0FBUztJQUMvQixpQkFBaUIsRUFBRSw4QkFBOEI7SUFDakQsdUJBQXVCLEVBQUUsNEhBQTRIO0lBQ3JKLDJCQUEyQixFQUFF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