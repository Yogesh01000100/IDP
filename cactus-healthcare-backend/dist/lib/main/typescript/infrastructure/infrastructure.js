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
// possible errors
exports.org1Env = {
    CORE_PEER_LOCALMSPID: "Org1MSP",
    CORE_PEER_ADDRESS: "peer0.org1.example.com:7051",
    CORE_PEER_MSPCONFIGPATH: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp",
    CORE_PEER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt",
    ORDERER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
};
// possible errors
exports.org2Env = {
    CORE_PEER_LOCALMSPID: "Org1MSP",
    CORE_PEER_ADDRESS: "peer0.org2.example.com:9151",
    CORE_PEER_MSPCONFIGPATH: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp",
    CORE_PEER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt",
    ORDERER_TLS_ROOTCERT_FILE: "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
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
            publishAllPorts: true,
            imageName: cactus_test_tooling_1.DEFAULT_FABRIC_2_AIO_IMAGE_NAME_V2,
            imageVersion: cactus_test_tooling_1.DEFAULT_FABRIC_2_AIO_IMAGE_VERSION_V2,
            envVars: new Map([
                ["FABRIC_VERSION", cactus_test_tooling_1.DEFAULT_FABRIC_2_AIO_FABRIC_VERSION_V2],
            ]),
            logLevel: level || "DEBUG",
        });
    }
    // org1Env possible cause for errors
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
    // org2Env  possible cause for errors
    get org2Env() {
        return {
            CORE_LOGGING_LEVEL: "debug",
            FABRIC_LOGGING_SPEC: "debug",
            CORE_PEER_LOCALMSPID: "Org2MSP",
            FABRIC_CFG_PATH: "/etc/hyperledger/fabric",
            CORE_PEER_TLS_ENABLED: "true",
            ORDERER_CA: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
            CORE_PEER_ADDRESS: "peer0.org2.example.com:9151",
            CORE_PEER_MSPCONFIGPATH: `${this.orgCfgDir}peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp`,
            CORE_PEER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt`,
            ORDERER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
        };
    }
    async start() {
        try {
            this.log.info(`Starting Healthcare infrastructure...`);
            await Promise.all([
                this.fabric1.start(),
                this.fabric2.start(),
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
        this.log.info(`Creating Fabric Connector1...`);
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
            cliContainerEnv: this.org2Env,
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
        this.log.info("Inside deployFabricContract1...");
        const channelId = "mychannel";
        const contractName = "EHRContract";
        const contractRelPath = "../../../fabric-contracts/contracts/typescript";
        const contractDir = path_1.default.join(__dirname, contractRelPath);
        const sourceFiles = [];
        {
            const filename = "./tsconfig.json";
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
            const filename = "./index.ts";
            const relativePath = "./src/";
            const filePath = path_1.default.join(contractDir, relativePath, filename);
            const buffer = await fs_extra_1.default.readFile(filePath);
            sourceFiles.push({
                body: buffer.toString("base64"),
                filepath: relativePath,
                filename,
            });
        }
        {
            const filename = "./EHR.ts";
            const relativePath = "./src/";
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
            this.log.info("Inside loop... count :", retries);
            await fabricApiClient
                .deployContractV1({
                channelId,
                ccVersion: "1.0.0",
                sourceFiles,
                ccName: contractName,
                targetOrganizations: [this.org1Env, this.org2Env],
                caFile: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
                ccLabel: "EHRContract",
                ccLang: cactus_plugin_ledger_connector_fabric_1.ChainCodeProgrammingLanguage.Typescript,
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
            })
                .catch(() => console.log("trying to deploy fabric contract again"));
            retries++;
        }
    }
    async deployFabricContract2(fabricApiClient) {
        this.log.info("Inside deployFabricContract2...");
        const channelId = "mychannel";
        const contractName = "EHRContract";
        const contractRelPath = "../../../fabric-contracts/contracts/typescript";
        const contractDir = path_1.default.join(__dirname, contractRelPath);
        const sourceFiles = [];
        {
            const filename = "./tsconfig.json";
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
            const filename = "./index.ts";
            const relativePath = "./src/";
            const filePath = path_1.default.join(contractDir, relativePath, filename);
            const buffer = await fs_extra_1.default.readFile(filePath);
            sourceFiles.push({
                body: buffer.toString("base64"),
                filepath: relativePath,
                filename,
            });
        }
        {
            const filename = "./contract.ts";
            const relativePath = "./src/";
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
            this.log.info("Inside loop... count :", retries);
            await fabricApiClient
                .deployContractV1({
                channelId,
                ccVersion: "1.0.0",
                sourceFiles,
                ccName: contractName,
                targetOrganizations: [this.org1Env, this.org2Env],
                caFile: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
                ccLabel: "HealthCareEHR",
                ccLang: cactus_plugin_ledger_connector_fabric_1.ChainCodeProgrammingLanguage.Typescript,
                ccSequence: 1,
                orderer: "orderer.example.com:7150",
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
            })
                .catch(() => console.log("trying to deploy fabric contract again"));
            retries++;
        }
    }
}
exports.HealthCareAppDummyInfrastructure = HealthCareAppDummyInfrastructure;
HealthCareAppDummyInfrastructure.CLASS_NAME = "HealthCareAppDummyInfrastructure";
HealthCareAppDummyInfrastructure.FABRIC_2_AIO_CLI_CFG_DIR = "/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmFzdHJ1Y3R1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2luZnJhc3RydWN0dXJlL2luZnJhc3RydWN0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNDQUFzQztBQUN0QyxnREFBd0I7QUFDeEIsK0JBQW9DO0FBQ3BDLHdEQUEwQjtBQUMxQiw4REFBMEY7QUFDMUYsMEVBUTBDO0FBQzFDLDhGQUFrRjtBQUNsRiw4R0FBNFA7QUFDNVAsMERBQTBEO0FBQzFELHlHQUEyRTtBQUMzRSxrQkFBa0I7QUFDTCxRQUFBLE9BQU8sR0FBRTtJQUNwQixvQkFBb0IsRUFBRSxTQUFTO0lBQy9CLGlCQUFpQixFQUFFLDZCQUE2QjtJQUNoRCx1QkFBdUIsRUFDckIsK0hBQStIO0lBQ2pJLDJCQUEyQixFQUN6QixzSUFBc0k7SUFDeEkseUJBQXlCLEVBQ3ZCLG1LQUFtSztDQUN0SyxDQUFDO0FBQ0Ysa0JBQWtCO0FBQ0wsUUFBQSxPQUFPLEdBQUU7SUFDcEIsb0JBQW9CLEVBQUUsU0FBUztJQUMvQixpQkFBaUIsRUFBRSw2QkFBNkI7SUFDaEQsdUJBQXVCLEVBQ3JCLCtIQUErSDtJQUNqSSwyQkFBMkIsRUFDekIsc0lBQXNJO0lBQ3hJLHlCQUF5QixFQUN2QixtS0FBbUs7Q0FDdEssQ0FBQztBQU1GLE1BQWEsZ0NBQWdDO0lBUzNDLElBQVcsU0FBUztRQUNsQixPQUFPLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQztJQUNyRCxDQUFDO0lBRUQsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sZ0NBQWdDLENBQUMsd0JBQXdCLENBQUM7SUFDbkUsQ0FBQztJQUVELFlBQTRCLE9BQXlDO1FBQXpDLFlBQU8sR0FBUCxPQUFPLENBQWtDO1FBQ25FLE1BQU0sS0FBSyxHQUFHLGdEQUFnRCxDQUFDO1FBQy9ELHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssY0FBYyxDQUFDLENBQUM7UUFFL0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO1FBQzlDLE1BQU0sS0FBSyxHQUFHLGtDQUFrQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV4RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksd0NBQWtCLENBQUM7WUFDcEMsZUFBZSxFQUFFLElBQUk7WUFDckIsU0FBUyxFQUFFLHFEQUErQjtZQUMxQyxZQUFZLEVBQUUsd0RBQWtDO1lBQ2hELE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQztnQkFDZixDQUFDLGdCQUFnQixFQUFFLHlEQUFtQyxDQUFDO2FBQ3hELENBQUM7WUFDRixRQUFRLEVBQUUsS0FBSyxJQUFJLE9BQU87U0FDM0IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLHdDQUFrQixDQUFDO1lBQ3BDLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLFNBQVMsRUFBRSx3REFBa0M7WUFDN0MsWUFBWSxFQUFFLDJEQUFxQztZQUNuRCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUM7Z0JBQ2YsQ0FBQyxnQkFBZ0IsRUFBRSw0REFBc0MsQ0FBQzthQUMzRCxDQUFDO1lBQ0YsUUFBUSxFQUFFLEtBQUssSUFBSSxPQUFPO1NBQzNCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxvQ0FBb0M7SUFDcEMsSUFBVyxPQUFPO1FBQ2hCLE9BQU87WUFDTCxrQkFBa0IsRUFBRSxPQUFPO1lBQzNCLG1CQUFtQixFQUFFLE9BQU87WUFDNUIsb0JBQW9CLEVBQUUsU0FBUztZQUUvQixVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyx5R0FBeUc7WUFFdEksZUFBZSxFQUFFLHlCQUF5QjtZQUMxQyxxQkFBcUIsRUFBRSxNQUFNO1lBQzdCLDJCQUEyQixFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsNEVBQTRFO1lBQzFILHVCQUF1QixFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMscUVBQXFFO1lBQy9HLGlCQUFpQixFQUFFLDZCQUE2QjtZQUNoRCx5QkFBeUIsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLHlHQUF5RztTQUN0SixDQUFDO0lBQ0osQ0FBQztJQUVELHFDQUFxQztJQUNyQyxJQUFXLE9BQU87UUFDaEIsT0FBTztZQUNMLGtCQUFrQixFQUFFLE9BQU87WUFDM0IsbUJBQW1CLEVBQUUsT0FBTztZQUM1QixvQkFBb0IsRUFBRSxTQUFTO1lBRS9CLGVBQWUsRUFBRSx5QkFBeUI7WUFDMUMscUJBQXFCLEVBQUUsTUFBTTtZQUM3QixVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyx5R0FBeUc7WUFFdEksaUJBQWlCLEVBQUUsNkJBQTZCO1lBQ2hELHVCQUF1QixFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMscUVBQXFFO1lBQy9HLDJCQUEyQixFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsNEVBQTRFO1lBQzFILHlCQUF5QixFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMseUdBQXlHO1NBQ3RKLENBQUM7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQUs7UUFDaEIsSUFBSTtZQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7WUFDdkQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDO2dCQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7YUFDckIsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztTQUN2RDtRQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsaURBQWlELEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEUsTUFBTSxFQUFFLENBQUM7U0FDVjtJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSTtRQUNmLElBQUk7WUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM3QixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDdkQsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDN0I7UUFBQyxPQUFPLEVBQUUsRUFBRTtZQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sRUFBRSxDQUFDO1NBQ1Y7SUFDSCxDQUFDO0lBRUQsMkVBQTJFO0lBQ3BFLEtBQUssQ0FBQyw0QkFBNEI7UUFDdkMsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUM1RSxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7WUFDMUQsWUFBWSxFQUFFLE1BQU07U0FDckIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7WUFDdEQsTUFBTSxFQUFFLGVBQWU7WUFDdkIsWUFBWSxFQUFFLE9BQU87WUFDckIsWUFBWSxFQUFFLE1BQU07U0FDckIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7WUFDdEQsTUFBTSxFQUFFLGVBQWU7WUFDdkIsWUFBWSxFQUFFLE9BQU87WUFDckIsWUFBWSxFQUFFLE1BQU07U0FDckIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1lBQzFELFlBQVksRUFBRSxNQUFNO1NBQ3JCLENBQUMsQ0FBQztRQUNILE1BQU0sZUFBZSxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBQ3ZELE1BQU0sRUFBRSxlQUFlO1lBQ3ZCLFlBQVksRUFBRSxRQUFRO1lBQ3RCLFlBQVksRUFBRSxNQUFNO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwRCxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQztRQUNsQyxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFMUQsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUM7UUFDbEMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTFELE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDO1FBQ25DLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUUzRCxNQUFNLGNBQWMsR0FBRyxJQUFJLG9EQUFvQixDQUFDO1lBQzlDLFVBQVUsRUFBRSxJQUFBLFNBQU0sR0FBRTtZQUNwQixVQUFVLEVBQUUsOEJBQWMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDakQsUUFBUSxFQUFFLFNBQVM7WUFDbkIsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDO2dCQUNmLENBQUMsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUM7Z0JBQ3hDLENBQUMsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUM7Z0JBQ3hDLENBQUMsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUM7YUFDekMsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUksNEJBQWMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6RSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sSUFBSSxtRUFBMkIsQ0FBQztZQUNyQyxVQUFVLEVBQUUsSUFBQSxTQUFNLEdBQUU7WUFDcEIsWUFBWSxFQUFFLHVCQUF1QjtZQUNyQyxVQUFVLEVBQUUsMEJBQTBCO1lBQ3RDLFFBQVEsRUFBRSxzQkFBc0I7WUFDaEMsY0FBYztZQUNkLGVBQWUsRUFBRSxJQUFJLENBQUMsT0FBTztZQUM3QixTQUFTO1lBQ1QsaUJBQWlCLEVBQUUscUJBQXFCO1lBQ3hDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxNQUFNO1lBQ3pDLGdCQUFnQixFQUFFO2dCQUNoQixPQUFPLEVBQUUsSUFBSTtnQkFDYixXQUFXLEVBQUUsSUFBSTthQUNsQjtZQUNELG1CQUFtQixFQUFFO2dCQUNuQixRQUFRLEVBQUUsbUVBQTJCLENBQUMsb0JBQW9CO2dCQUMxRCxhQUFhLEVBQUUsR0FBRzthQUNuQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCw0RUFBNEU7SUFDckUsS0FBSyxDQUFDLDRCQUE0QjtRQUN2QyxNQUFNLHFCQUFxQixHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQzVFLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUMxRCxZQUFZLEVBQUUsTUFBTTtTQUNyQixDQUFDLENBQUM7UUFDSCxNQUFNLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztZQUN0RCxNQUFNLEVBQUUsZUFBZTtZQUN2QixZQUFZLEVBQUUsT0FBTztZQUNyQixZQUFZLEVBQUUsTUFBTTtTQUNyQixDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztZQUN0RCxNQUFNLEVBQUUsZUFBZTtZQUN2QixZQUFZLEVBQUUsT0FBTztZQUNyQixZQUFZLEVBQUUsTUFBTTtTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7WUFDMUQsWUFBWSxFQUFFLE1BQU07U0FDckIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7WUFDdkQsTUFBTSxFQUFFLGVBQWU7WUFDdkIsWUFBWSxFQUFFLFFBQVE7WUFDdEIsWUFBWSxFQUFFLE1BQU07U0FDckIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXBELE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDO1FBQ2xDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUxRCxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQztRQUNsQyxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFMUQsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUM7UUFDbkMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTNELE1BQU0sY0FBYyxHQUFHLElBQUksb0RBQW9CLENBQUM7WUFDOUMsVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1lBQ3BCLFVBQVUsRUFBRSw4QkFBYyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNqRCxRQUFRLEVBQUUsU0FBUztZQUNuQixPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUM7Z0JBQ2YsQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQztnQkFDeEMsQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQztnQkFDeEMsQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQzthQUN6QyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsSUFBSSw0QkFBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDOUMsT0FBTyxJQUFJLG1FQUEyQixDQUFDO1lBQ3JDLFVBQVUsRUFBRSxJQUFBLFNBQU0sR0FBRTtZQUNwQixZQUFZLEVBQUUsdUJBQXVCO1lBQ3JDLFVBQVUsRUFBRSwwQkFBMEI7WUFDdEMsUUFBUSxFQUFFLHNCQUFzQjtZQUNoQyxjQUFjO1lBQ2QsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQzdCLFNBQVM7WUFDVCxpQkFBaUIsRUFBRSxxQkFBcUI7WUFDeEMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU07WUFDekMsZ0JBQWdCLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRSxJQUFJO2dCQUNiLFdBQVcsRUFBRSxJQUFJO2FBQ2xCO1lBQ0QsbUJBQW1CLEVBQUU7Z0JBQ25CLFFBQVEsRUFBRSxtRUFBMkIsQ0FBQyxvQkFBb0I7Z0JBQzFELGFBQWEsRUFBRSxHQUFHO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDhDQUE4QztJQUN2QyxLQUFLLENBQUMscUJBQXFCLENBQ2hDLGVBQTBCO1FBRTFCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFFakQsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDO1FBRTlCLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQztRQUVuQyxNQUFNLGVBQWUsR0FBRyxnREFBZ0QsQ0FBQztRQUN6RSxNQUFNLFdBQVcsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUUxRCxNQUFNLFdBQVcsR0FBaUIsRUFBRSxDQUFDO1FBQ3JDO1lBQ0UsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUM7WUFDbkMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQzFCLE1BQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNoRSxNQUFNLE1BQU0sR0FBRyxNQUFNLGtCQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLFdBQVcsQ0FBQyxJQUFJLENBQUM7Z0JBQ2YsSUFBSSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2dCQUMvQixRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUTthQUNULENBQUMsQ0FBQztTQUNKO1FBQ0Q7WUFDRSxNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQztZQUNsQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDMUIsTUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sTUFBTSxHQUFHLE1BQU0sa0JBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsV0FBVyxDQUFDLElBQUksQ0FBQztnQkFDZixJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRO2FBQ1QsQ0FBQyxDQUFDO1NBQ0o7UUFDRDtZQUNFLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQztZQUM5QixNQUFNLFlBQVksR0FBRyxRQUFRLENBQUM7WUFDOUIsTUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sTUFBTSxHQUFHLE1BQU0sa0JBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsV0FBVyxDQUFDLElBQUksQ0FBQztnQkFDZixJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRO2FBQ1QsQ0FBQyxDQUFDO1NBQ0o7UUFDRDtZQUNFLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQztZQUM1QixNQUFNLFlBQVksR0FBRyxRQUFRLENBQUM7WUFDOUIsTUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sTUFBTSxHQUFHLE1BQU0sa0JBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsV0FBVyxDQUFDLElBQUksQ0FBQztnQkFDZixJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRO2FBQ1QsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3pDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixPQUFPLE9BQU8sSUFBSSxDQUFDLEVBQUU7WUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakQsTUFBTSxlQUFlO2lCQUNsQixnQkFBZ0IsQ0FDZjtnQkFDRSxTQUFTO2dCQUNULFNBQVMsRUFBRSxPQUFPO2dCQUNsQixXQUFXO2dCQUNYLE1BQU0sRUFBRSxZQUFZO2dCQUNwQixtQkFBbUIsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDakQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMseUdBQXlHO2dCQUNsSSxPQUFPLEVBQUUsYUFBYTtnQkFDdEIsTUFBTSxFQUFFLG9FQUE0QixDQUFDLFVBQVU7Z0JBQy9DLFVBQVUsRUFBRSxDQUFDO2dCQUNiLE9BQU8sRUFBRSwwQkFBMEI7Z0JBQ25DLDBCQUEwQixFQUFFLHFCQUFxQjtnQkFDakQsV0FBVyxFQUFFLEdBQUc7YUFDakIsRUFDRDtnQkFDRSxnQkFBZ0IsRUFBRSxRQUFRO2dCQUMxQixhQUFhLEVBQUUsUUFBUTthQUN4QixDQUNGO2lCQUNBLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBa0QsRUFBRSxFQUFFO2dCQUNqRSxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUVaLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFFM0MsTUFBTSxFQUNKLG1CQUFtQixFQUNuQixXQUFXLEVBQ1gsa0JBQWtCLEVBQ2xCLE1BQU0sRUFDTixTQUFTLEVBQ1QsY0FBYyxHQUNmLEdBQUcsU0FBUyxDQUFDO2dCQUVkLHNCQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO2dCQUNsRCxzQkFBTSxDQUFDLE1BQU0sQ0FDWCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUN6QixxQ0FBcUMsQ0FDdEMsQ0FBQztnQkFDRixzQkFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO2dCQUNwRSxzQkFBTSxDQUFDLE1BQU0sQ0FDWCxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEVBQ2xDLDhDQUE4QyxDQUMvQyxDQUFDO2dCQUNGLHNCQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNwRCxzQkFBTSxDQUFDLE1BQU0sQ0FDWCxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUMxQixzQ0FBc0MsQ0FDdkMsQ0FBQztnQkFDRixzQkFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO2dCQUNsRSxzQkFBTSxDQUFDLE1BQU0sQ0FDWCxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEVBQ2pDLDZDQUE2QyxDQUM5QyxDQUFDO2dCQUNGLHNCQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMxQyxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsQ0FBQztnQkFDaEQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLDBCQUEwQixDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FBQztZQUN0RSxPQUFPLEVBQUUsQ0FBQztTQUNYO0lBQ0gsQ0FBQztJQUNNLEtBQUssQ0FBQyxxQkFBcUIsQ0FDaEMsZUFBMEI7UUFHMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUNqRCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7UUFFOUIsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDO1FBRW5DLE1BQU0sZUFBZSxHQUFHLGdEQUFnRCxDQUFDO1FBQ3pFLE1BQU0sV0FBVyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBRTFELE1BQU0sV0FBVyxHQUFpQixFQUFFLENBQUM7UUFDckM7WUFDRSxNQUFNLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQztZQUNuQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDMUIsTUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sTUFBTSxHQUFHLE1BQU0sa0JBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsV0FBVyxDQUFDLElBQUksQ0FBQztnQkFDZixJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRO2FBQ1QsQ0FBQyxDQUFDO1NBQ0o7UUFDRDtZQUNFLE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDO1lBQ2xDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQztZQUMxQixNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUNmLElBQUksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDL0IsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLFFBQVE7YUFDVCxDQUFDLENBQUM7U0FDSjtRQUNEO1lBQ0UsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDO1lBQzlCLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQztZQUM5QixNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUNmLElBQUksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDL0IsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLFFBQVE7YUFDVCxDQUFDLENBQUM7U0FDSjtRQUNEO1lBQ0UsTUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDO1lBQ2pDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQztZQUM5QixNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUNmLElBQUksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDL0IsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLFFBQVE7YUFDVCxDQUFDLENBQUM7U0FDSjtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDekMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE9BQU8sT0FBTyxJQUFJLENBQUMsRUFBRTtZQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNqRCxNQUFNLGVBQWU7aUJBQ2xCLGdCQUFnQixDQUNmO2dCQUNFLFNBQVM7Z0JBQ1QsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLFdBQVc7Z0JBQ1gsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLG1CQUFtQixFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyx5R0FBeUc7Z0JBQ2xJLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixNQUFNLEVBQUUsb0VBQTRCLENBQUMsVUFBVTtnQkFDL0MsVUFBVSxFQUFFLENBQUM7Z0JBQ2IsT0FBTyxFQUFFLDBCQUEwQjtnQkFDbkMsMEJBQTBCLEVBQUUscUJBQXFCO2dCQUNqRCxXQUFXLEVBQUUsR0FBRzthQUNqQixFQUNEO2dCQUNFLGdCQUFnQixFQUFFLFFBQVE7Z0JBQzFCLGFBQWEsRUFBRSxRQUFRO2FBQ3hCLENBQ0Y7aUJBQ0EsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFrRCxFQUFFLEVBQUU7Z0JBQ2pFLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBRVosTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUUzQyxNQUFNLEVBQ0osbUJBQW1CLEVBQ25CLFdBQVcsRUFDWCxrQkFBa0IsRUFDbEIsTUFBTSxFQUNOLFNBQVMsRUFDVCxjQUFjLEdBQ2YsR0FBRyxTQUFTLENBQUM7Z0JBRWQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLHNCQUFzQixDQUFDLENBQUM7Z0JBQ2xELHNCQUFNLENBQUMsTUFBTSxDQUNYLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQ3pCLHFDQUFxQyxDQUN0QyxDQUFDO2dCQUNGLHNCQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLCtCQUErQixDQUFDLENBQUM7Z0JBQ3BFLHNCQUFNLENBQUMsTUFBTSxDQUNYLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsRUFDbEMsOENBQThDLENBQy9DLENBQUM7Z0JBQ0Ysc0JBQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLHVCQUF1QixDQUFDLENBQUM7Z0JBQ3BELHNCQUFNLENBQUMsTUFBTSxDQUNYLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQzFCLHNDQUFzQyxDQUN2QyxDQUFDO2dCQUNGLHNCQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLDhCQUE4QixDQUFDLENBQUM7Z0JBQ2xFLHNCQUFNLENBQUMsTUFBTSxDQUNYLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsRUFDakMsNkNBQTZDLENBQzlDLENBQUM7Z0JBQ0Ysc0JBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQzFDLHNCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUNoRCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sRUFBRSxDQUFDO1NBQ1g7SUFDSCxDQUFDOztBQTFmSCw0RUE0ZkM7QUEzZndCLDJDQUFVLEdBQUcsa0NBQWtDLENBQUM7QUFDaEQseURBQXdCLEdBQzdDLG1FQUFtRSxDQUFDIn0=