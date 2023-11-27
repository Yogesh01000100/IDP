/* eslint-disable prettier/prettier */
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";
import { Logger, Checks, LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import { FabricTestLedgerV1, 
  FabricTestLedgerV2, 
  DEFAULT_FABRIC_2_AIO_FABRIC_VERSION, 
  DEFAULT_FABRIC_2_AIO_IMAGE_NAME,
  DEFAULT_FABRIC_2_AIO_IMAGE_VERSION,
  DEFAULT_FABRIC_2_AIO_FABRIC_VERSION_V2, 
  DEFAULT_FABRIC_2_AIO_IMAGE_NAME_V2,
  DEFAULT_FABRIC_2_AIO_IMAGE_VERSION_V2,
} from "@hyperledger/cactus-test-tooling";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import { DefaultApi as FabricApi, ChainCodeProgrammingLanguage, DefaultEventHandlerStrategy, DeploymentTargetOrgFabric2x, FabricContractInvocationType, FileBase64, PluginLedgerConnectorFabric } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import { PluginRegistry } from "@hyperledger/cactus-core";
import CryptoMaterial from "../../../crypto-material/crypto-material.json";



// [for fab net -1] possible errors
export const org1Env= {
  CORE_PEER_LOCALMSPID: "Org1MSP",
  CORE_PEER_ADDRESS: "peer0.org1.example.com:7051",
  CORE_PEER_MSPCONFIGPATH:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp",
  CORE_PEER_TLS_ROOTCERT_FILE:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt",
  ORDERER_TLS_ROOTCERT_FILE:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
};
// [for fab net -1] possible errors
export const org2Env = {
  CORE_PEER_LOCALMSPID: "Org2MSP", // Corrected MSP ID for Org2
  CORE_PEER_ADDRESS: "peer0.org2.example.com:9051", // Ensure this address is correct for Org2's peer
  CORE_PEER_MSPCONFIGPATH:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org1.example.com/msp", // Path to Org2's MSP configuration
  CORE_PEER_TLS_ROOTCERT_FILE:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt", // Path to Org2's TLS root certificate
  ORDERER_TLS_ROOTCERT_FILE:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem", // Ensure this is the correct path for the orderer's TLS root certificate
};


// [for fab net -2] possible errors
export const org3Env= {
  CORE_PEER_LOCALMSPID: "Org1MSP",
  CORE_PEER_ADDRESS: "peer0.org1.example.com:8001",
  CORE_PEER_MSPCONFIGPATH:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp",
  CORE_PEER_TLS_ROOTCERT_FILE:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt",
  ORDERER_TLS_ROOTCERT_FILE:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem",
};
// [for fab net -2] possible errors
export const org4Env = {
  CORE_PEER_LOCALMSPID: "Org2MSP", // Corrected MSP ID for Org2
  CORE_PEER_ADDRESS: "peer0.org2.example.com:10004", // Ensure this address is correct for Org2's peer
  CORE_PEER_MSPCONFIGPATH:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org1.example.com/msp", // Path to Org2's MSP configuration
  CORE_PEER_TLS_ROOTCERT_FILE:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt", // Path to Org2's TLS root certificate
  ORDERER_TLS_ROOTCERT_FILE:
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem", // Ensure this is the correct path for the orderer's TLS root certificate
};


export interface IHealthCareInfrastructureOptions {
  logLevel?: LogLevelDesc;
}

export class HealthCareAppDummyInfrastructure {
  public static readonly CLASS_NAME = "HealthCareAppDummyInfrastructure";
  public static readonly FABRIC_2_AIO_CLI_CFG_DIR =
    "/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/";

  private readonly fabric1: FabricTestLedgerV1;
  private readonly fabric2: FabricTestLedgerV2;
  private readonly log: Logger;

  public get className(): string {
    return HealthCareAppDummyInfrastructure.CLASS_NAME;
  }

  public get orgCfgDir(): string { // error cause
    return HealthCareAppDummyInfrastructure.FABRIC_2_AIO_CLI_CFG_DIR;
  }

  constructor(public readonly options: IHealthCareInfrastructureOptions) {
    const fnTag = `HealthCareAppDummyInfrastructure#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);

    const level = this.options.logLevel || "INFO";
    const label = "HealthCareAppDummyInfrastructure";
    this.log = LoggerProvider.getOrCreate({ level, label });

    this.fabric1 = new FabricTestLedgerV1({
      publishAllPorts: true,
      imageName: DEFAULT_FABRIC_2_AIO_IMAGE_NAME,
      imageVersion: DEFAULT_FABRIC_2_AIO_IMAGE_VERSION,
      envVars: new Map([
        ["FABRIC_VERSION", DEFAULT_FABRIC_2_AIO_FABRIC_VERSION],
      ]),
      logLevel: level || "DEBUG",
    });

    this.fabric2 = new FabricTestLedgerV2({ // change this
      publishAllPorts: true,
      imageName: DEFAULT_FABRIC_2_AIO_IMAGE_NAME_V2,
      imageVersion: DEFAULT_FABRIC_2_AIO_IMAGE_VERSION_V2,
      envVars: new Map([
        ["FABRIC_VERSION", DEFAULT_FABRIC_2_AIO_FABRIC_VERSION_V2],
      ]),
      logLevel: level || "DEBUG",
    });
  }

  public get org1Env(): NodeJS.ProcessEnv & DeploymentTargetOrgFabric2x {
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

  public get org2Env(): NodeJS.ProcessEnv & DeploymentTargetOrgFabric2x {
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

  public get org3Env(): NodeJS.ProcessEnv & DeploymentTargetOrgFabric2x {
    return {
      CORE_LOGGING_LEVEL: "debug",
      FABRIC_LOGGING_SPEC: "debug",
      CORE_PEER_LOCALMSPID: "Org1MSP",

      ORDERER_CA: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,

      FABRIC_CFG_PATH: "/etc/hyperledger/fabric",
      CORE_PEER_TLS_ENABLED: "true",
      CORE_PEER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt`,
      CORE_PEER_MSPCONFIGPATH: `${this.orgCfgDir}peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp`,
      CORE_PEER_ADDRESS: "peer0.org1.example.com:8001",
      ORDERER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
    };
  }

  public get org4Env(): NodeJS.ProcessEnv & DeploymentTargetOrgFabric2x {
    return {
      CORE_LOGGING_LEVEL: "debug",
      FABRIC_LOGGING_SPEC: "debug",
      CORE_PEER_LOCALMSPID: "Org2MSP",

      FABRIC_CFG_PATH: "/etc/hyperledger/fabric",
      CORE_PEER_TLS_ENABLED: "true",
      ORDERER_CA: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,

      CORE_PEER_ADDRESS: "peer0.org2.example.com:10004",
      CORE_PEER_MSPCONFIGPATH: `${this.orgCfgDir}peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp`,
      CORE_PEER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt`,
      ORDERER_TLS_ROOTCERT_FILE: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
    };
  }

  public async start(): Promise<void> {
    try {
      this.log.info(`Starting Healthcare infrastructure...`);
      await Promise.all([
        this.fabric1.start()
      ]);
      this.log.info(`Started Healthcare infrastructure OK`);
    } catch (ex) {
      this.log.error(`Starting of Healthcare infrastructure crashed: `, ex);
      throw ex;
    }
  }

  public async stop(): Promise<void> {
    try {
      this.log.info(`Stopping...`);
      await Promise.all([
        this.fabric1.stop().then(() => this.fabric1.destroy())
      ]);
      this.log.info(`Stopped OK`);
    } catch (ex) {
      this.log.error(`Stopping crashed: `, ex);
      throw ex;
    }
  }

  public async createFabric1LedgerConnector(): Promise<PluginLedgerConnectorFabric> {
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

    const keychainPlugin = new PluginKeychainMemory({
      instanceId: uuidv4(),
      keychainId: CryptoMaterial.keychains.keychain1.id,
      logLevel: undefined,
      backend: new Map([
        [keychainEntryKey1, keychainEntryValue1],
        [keychainEntryKey2, keychainEntryValue2],
        [keychainEntryKey3, keychainEntryValue3],
      ]),
    });

    const pluginRegistry = new PluginRegistry({ plugins: [keychainPlugin] });

    this.log.info(`Creating Fabric Connector1...`);
    return new PluginLedgerConnectorFabric({
      instanceId: uuidv4(),
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
        strategy: DefaultEventHandlerStrategy.NetworkScopeAllfortx,
        commitTimeout: 300,
      },
    });
  }

  // possible errors
  public async createFabric2LedgerConnector(): Promise<PluginLedgerConnectorFabric> {
    const connectionProfileOrg1 = await this.fabric2.getConnectionProfileOrg1();
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

    const keychainPlugin = new PluginKeychainMemory({
      instanceId: uuidv4(),
      keychainId: CryptoMaterial.keychains.keychain1.id,
      logLevel: undefined,
      backend: new Map([
        [keychainEntryKey1, keychainEntryValue1],
        [keychainEntryKey2, keychainEntryValue2],
        [keychainEntryKey3, keychainEntryValue3],
      ]),
    });

    const pluginRegistry = new PluginRegistry({ plugins: [keychainPlugin] });

    this.log.info(`Creating Fabric Connector 2...`);
    return new PluginLedgerConnectorFabric({
      instanceId: uuidv4(),
      dockerBinary: "/usr/local/bin/docker", // changes req 
      peerBinary: "/fabric-samples/bin/peer", // changes req 
      goBinary: "/usr/local/go/bin/go", // changes req 
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
        strategy: DefaultEventHandlerStrategy.NetworkScopeAllfortx,
        commitTimeout: 300,
      },
    });
  }
  
  // chaincode deployment in both networks
  public async deployFabricContract1(
    fabricApiClient: FabricApi,
  ): Promise<void>{
    this.log.info("Inside deployFabricContract1...");

    const channelId = "mychannel";

    const contractName = "EHRContract";

    const contractRelPath = "../../../fabric-contracts/contracts/typescript";
    const contractDir = path.join(__dirname, contractRelPath);

    const sourceFiles: FileBase64[] = [];
    {
      const filename = "./tsconfig.json";
      const relativePath = "./";
      const filePath = path.join(contractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      sourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./package.json";
      const relativePath = "./";
      const filePath = path.join(contractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      sourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./index.ts";
      const relativePath = "./src/";
      const filePath = path.join(contractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      sourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./EHR.ts";
      const relativePath = "./src/";
      const filePath = path.join(contractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
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
        .deployContractV1(
          {
            channelId,
            ccVersion: "1.0.0",
            sourceFiles,
            ccName: contractName,
            targetOrganizations: [this.org1Env,this.org2Env],
            caFile: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
            ccLabel: "EHRContract",
            ccLang: ChainCodeProgrammingLanguage.Typescript,
            ccSequence: 1,
            orderer: "orderer.example.com:7050",
            ordererTLSHostnameOverride: "orderer.example.com",
            connTimeout: 120,
          },
          {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          },
        )
        .then(async (res: { data: { packageIds: any; lifecycle: any } }) => {
          retries = 6;

          const { packageIds, lifecycle } = res.data;

          const {
            approveForMyOrgList,
            installList,
            queryInstalledList,
            commit,
            packaging,
            queryCommitted,
          } = lifecycle;

          Checks.truthy(packageIds, `packageIds truthy OK`);
          Checks.truthy(
            Array.isArray(packageIds),
            `Array.isArray(packageIds) truthy OK`,
          );
          Checks.truthy(approveForMyOrgList, `approveForMyOrgList truthy OK`);
          Checks.truthy(
            Array.isArray(approveForMyOrgList),
            `Array.isArray(approveForMyOrgList) truthy OK`,
          );
          Checks.truthy(installList, `installList truthy OK`);
          Checks.truthy(
            Array.isArray(installList),
            `Array.isArray(installList) truthy OK`,
          );
          Checks.truthy(queryInstalledList, `queryInstalledList truthy OK`);
          Checks.truthy(
            Array.isArray(queryInstalledList),
            `Array.isArray(queryInstalledList) truthy OK`,
          );
          Checks.truthy(commit, `commit truthy OK`);
          Checks.truthy(packaging, `packaging truthy OK`);
          Checks.truthy(queryCommitted, `queryCommitted truthy OK`);
        })
        .catch(() => console.log("trying to deploy fabric contract again"));
      retries++;
    }
  }
  public async deployFabricContract2(
    fabricApiClient: FabricApi,
  ): Promise<void>{

    this.log.info("Inside deployFabricContract2...");

    const channelId = "mychannel";

    const contractName = "EHRContract";

    const contractRelPath = "../../../fabric-contracts/contracts/typescript";
    const contractDir = path.join(__dirname, contractRelPath);

    const sourceFiles: FileBase64[] = [];
    {
      const filename = "./tsconfig.json";
      const relativePath = "./";
      const filePath = path.join(contractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      sourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./package.json";
      const relativePath = "./";
      const filePath = path.join(contractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      sourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./index.ts";
      const relativePath = "./src/";
      const filePath = path.join(contractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
      sourceFiles.push({
        body: buffer.toString("base64"),
        filepath: relativePath,
        filename,
      });
    }
    {
      const filename = "./EHR.ts";
      const relativePath = "./src/";
      const filePath = path.join(contractDir, relativePath, filename);
      const buffer = await fs.readFile(filePath);
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
        .deployContractV1(
          {
            channelId,
            ccVersion: "1.0.0",
            sourceFiles,
            ccName: contractName,
            targetOrganizations: [this.org3Env,this.org4Env],
            caFile: `${this.orgCfgDir}ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`,
            ccLabel: "EHRContract",
            ccLang: ChainCodeProgrammingLanguage.Typescript,
            ccSequence: 1,
            orderer: "orderer.example.com:8000",
            ordererTLSHostnameOverride: "orderer.example.com",
            connTimeout: 120,
          },
          {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          },
        )
        .then(async (res: { data: { packageIds: any; lifecycle: any } }) => {
          retries = 6;

          const { packageIds, lifecycle } = res.data;

          const {
            approveForMyOrgList,
            installList,
            queryInstalledList,
            commit,
            packaging,
            queryCommitted,
          } = lifecycle;

          Checks.truthy(packageIds, `packageIds truthy OK`);
          Checks.truthy(
            Array.isArray(packageIds),
            `Array.isArray(packageIds) truthy OK`,
          );
          Checks.truthy(approveForMyOrgList, `approveForMyOrgList truthy OK`);
          Checks.truthy(
            Array.isArray(approveForMyOrgList),
            `Array.isArray(approveForMyOrgList) truthy OK`,
          );
          Checks.truthy(installList, `installList truthy OK`);
          Checks.truthy(
            Array.isArray(installList),
            `Array.isArray(installList) truthy OK`,
          );
          Checks.truthy(queryInstalledList, `queryInstalledList truthy OK`);
          Checks.truthy(
            Array.isArray(queryInstalledList),
            `Array.isArray(queryInstalledList) truthy OK`,
          );
          Checks.truthy(commit, `commit truthy OK`);
          Checks.truthy(packaging, `packaging truthy OK`);
          Checks.truthy(queryCommitted, `queryCommitted truthy OK`);
        })
        .catch(() => console.log("trying to deploy fabric contract again"));
      retries++;
    }
  }

}
