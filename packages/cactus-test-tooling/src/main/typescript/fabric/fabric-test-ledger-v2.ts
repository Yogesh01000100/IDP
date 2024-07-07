import compareVersions from "compare-versions";
import temp from "temp";
import { Wallets, Gateway, Wallet, X509Identity } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import os from "os";

import {
  Checks,
  Logger,
  LogLevelDesc,
  LoggerProvider,
  Bools,
  safeStringifyException,
} from "@hyperledger/cactus-common";

import {
  NodeSSH,
  Config as SshConfig,
  SSHExecCommandOptions,
  SSHExecCommandResponse,
} from "node-ssh";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import { RuntimeError } from "run-time-error-cjs";

export interface organizationDefinitionFabricV2_V2 {
  path: string;
  orgName: string;
  orgChannel: string;
  certificateAuthority: boolean;
  stateDatabase: STATE_DATABASE_V2;
  port: string;
}

export interface EnrollFabricIdentityOptionsV1 {
  readonly wallet: Wallet;
  readonly enrollmentID: string;
  readonly organization: string;
  readonly roles?: string[];
  readonly capabilities?: string[];
}

export interface IFabricTestLedgerV2ConstructorOptions {
  envVars?: Map<string, string>;
  logLevel?: LogLevelDesc;
  emitContainerLogs?: boolean;
  stateDatabase?: STATE_DATABASE_V2;
  orgList?: string[];
  extraOrgs?: organizationDefinitionFabricV2_V2[];
  // For test development, attach to ledger that is already running, don't spin up new one
  useRunningLedger?: boolean;
}

export enum STATE_DATABASE_V2 {
  LEVEL_DB = "leveldb",
  COUCH_DB = "couchdb",
}
export interface LedgerStartOptions_V2 {
  omitPull?: boolean;
  setContainer?: boolean;
  containerID?: string;
}

/*
 * Provides default options for Fabric container
 */
const DEFAULT_OPTS = Object.freeze({
  envVars: new Map([["FABRIC_VERSION", "1.4.8"]]),
  stateDatabase: STATE_DATABASE_V2.COUCH_DB,
  orgList: ["org1", "org2"],
});
export const FABRIC_TEST_LEDGER_DEFAULT_OPTIONS_V2 = DEFAULT_OPTS;

// ports and paths yet to be changed
export class FabricTestLedgerV2 {
  public static readonly CLASS_NAME = "FabricTestLedgerV2";
  public readonly emitContainerLogs: boolean;
  public readonly envVars: Map<string, string>;
  public readonly stateDatabase: STATE_DATABASE_V2;
  public orgList: string[];
  public readonly testLedgerId: string;
  public extraOrgs: organizationDefinitionFabricV2_V2[] | undefined;

  private readonly log: Logger;

  private containerId: string | undefined;

  public get className(): string {
    return FabricTestLedgerV2.CLASS_NAME;
  }

  constructor(public readonly options: IFabricTestLedgerV2ConstructorOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });

    this.emitContainerLogs = Bools.isBooleanStrict(options.emitContainerLogs)
      ? (options.emitContainerLogs as boolean)
      : true;
    this.envVars = options.envVars || DEFAULT_OPTS.envVars;
    this.stateDatabase = options.stateDatabase || DEFAULT_OPTS.stateDatabase;
    this.orgList = options.orgList || DEFAULT_OPTS.orgList;
    this.extraOrgs = options.extraOrgs;

    if (compareVersions.compare(this.getFabricVersion(), "1.4", "<"))
      this.log.warn(
        `This version of Fabric ${this.getFabricVersion()} is unsupported`
      );

    this.testLedgerId = `Fabric-network-2`;
  }

  public getFabricVersion(): string {
    return `${this.envVars.get("FABRIC_VERSION")}`;
  }

  public capitalizedMspIdOfOrg(organization: string): string {
    return organization.charAt(0).toUpperCase() + organization.slice(1) + "MSP";
  }

  public getDefaultMspId(): string {
    return "Org1MSP";
  }

  // checked
  public async createCaClientV2(
    organization: string
  ): Promise<FabricCAServices> {
    const fnTag = `${this.className}#createCaClientV2()`;
    this.log.debug(`${fnTag} ENTER`);
    try {
      const ccp = await this.getConnectionProfileOrgX(organization);
      const caInfo =
        ccp.certificateAuthorities["ca." + organization + ".example.com"];
      const { tlsCACerts, url: caUrl, caName } = caInfo;
      const { pem: caTLSCACertPem } = tlsCACerts;
      const tlsOptions = { trustedRoots: caTLSCACertPem, verify: false };
      this.log.debug(`createCaClientV2() caName=%o caUrl=%o`, caName, caUrl);
      this.log.debug(`createCaClientV2() tlsOptions=%o`, tlsOptions);
      return new FabricCAServices(caUrl, tlsOptions, caName);
    } catch (ex) {
      this.log.error(`createCaClientV2() Failure:`, ex);
      throw new RuntimeError(`${fnTag} Inner Exception:`, ex);
    }
  }
  // checked
  public async createCaClient(): Promise<FabricCAServices> {
    const fnTag = `${this.className}#createCaClient()`;
    try {
      return this.createCaClientV2("org1");
    } catch (ex) {
      this.log.error(`createCaClient() Failure:`, ex);
      throw new RuntimeError(`${fnTag} Inner Exception:`, ex);
    }
  }
  // checked
  public async enrollUserV2(opts: EnrollFabricIdentityOptionsV1): Promise<any> {
    const fnTag = `${this.className}#enrollUserV2()`;

    Checks.truthy(opts, "enrollUserV2 opts");
    Checks.nonBlankString(opts.organization, "enrollUserV2 opts.organization");
    Checks.nonBlankString(opts.enrollmentID, "enrollUserV2 opts.enrollmentID");
    Checks.truthy(opts.wallet, "enrollUserV2 opts.wallet");

    const { enrollmentID, organization, wallet, roles, capabilities } = opts;
    try {
      const mspId = this.capitalizedMspIdOfOrg(organization);
      const connectionProfile =
        await this.getConnectionProfileOrgX(organization);
      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      const discovery = { enabled: true, asLocalhost: true };
      const gatewayOptions = {
        wallet,
        identity: "admin",
        discovery,
      };
      await gateway.connect(connectionProfile, gatewayOptions);

      // Get the CA client object from the gateway for interacting with the CA.
      // const ca = gateway.getClient().getCertificateAuthority();
      const ca = await this.createCaClientV2(opts.organization);
      const adminIdentity = gateway.getIdentity();

      // Register the user, enroll the user, and import the new identity into the wallet.
      const registrationRequest = {
        affiliation: opts.organization + ".department1",
        enrollmentID: opts.enrollmentID,
        role: "client",
        attrs: [
          { name: "role", value: `${roles}`, ecert: true },
          { name: "capabilities", value: `${capabilities}`, ecert: true },
        ],
      };
      const capabilitiesArray = registrationRequest.attrs.find(
        (attr) => attr.name === "Capabilities"
      );
      if (capabilitiesArray) {
        console.log("Capabilities:", capabilitiesArray.value.split(","));
      } else {
        console.log(
          "No 'Capabilities' attribute found in the registration request."
        );
      }
      const provider = opts.wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, "admin");

      const secret = await ca.register(registrationRequest, adminUser);
      this.log.debug(`Registered client user "${enrollmentID}" OK`);

      const enrollmentRequest = { enrollmentID, enrollmentSecret: secret };
      const enrollment = await ca.enroll(enrollmentRequest);
      this.log.debug(`Enrolled client user "${enrollmentID}" OK`);

      const { certificate, key } = enrollment;
      const keyBytes = key.toBytes();

      const x509Identity: X509Identity = {
        credentials: {
          certificate: certificate,
          privateKey: keyBytes,
        },
        mspId,
        type: "X.509",
      };
      await wallet.put(enrollmentID, x509Identity);
      this.log.debug(`Wallet import of "${enrollmentID}" OK`);

      return [x509Identity, wallet];
    } catch (ex) {
      this.log.error(`${fnTag} failed with inner exception:`, ex);
      throw new RuntimeError(`${fnTag} failed with inner exception:`, ex);
    }
  }
  // checked
  public async enrollUser(wallet: Wallet): Promise<any> {
    const fnTag = `${this.className}#enrollUser()`;
    try {
      const enrollmentID = "user";
      const opts = { enrollmentID, organization: "org1", wallet };
      const out = await this.enrollUserV2(opts);
      return out;
    } catch (ex) {
      this.log.error(`${fnTag} failed with inner exception:`, ex);
      throw new RuntimeError(`${fnTag} failed with inner exception:`, ex);
    }
  }

  /**
   * Tuple of [adminUsername, adminSecret]
   */
  public get adminCredentials(): [string, string] {
    return ["admin", "adminpw"];
  }

  // checked
  public async enrollAdminV2(
    opts: Partial<EnrollFabricIdentityOptionsV1>
  ): Promise<[X509Identity, Wallet]> {
    const fnTag = `${this.className}#enrollAdminV2()`;
    this.log.debug(`${fnTag} ENTER`);

    const { organization } = opts;
    if (!organization) {
      throw new RuntimeError(`${fnTag} opts.organization cannot be falsy.`);
    }
    Checks.nonBlankString(organization, `${fnTag}:opts.organization`);

    try {
      const ca = await this.createCaClientV2(organization);
      const wallet = await Wallets.newInMemoryWallet();

      // Enroll the admin user, and import the new identity into the wallet.
      const request = {
        enrollmentID: this.adminCredentials[0],
        enrollmentSecret: this.adminCredentials[1],
      };
      const enrollment = await ca.enroll(request);

      const mspId = this.capitalizedMspIdOfOrg(organization);
      const { certificate, key } = enrollment;
      const keyBytes = key.toBytes();

      const x509Identity: X509Identity = {
        credentials: {
          certificate: certificate,
          privateKey: keyBytes,
        },
        mspId,
        type: "X.509",
      };

      await wallet.put("admin", x509Identity);
      return [x509Identity, wallet];
    } catch (ex) {
      this.log.error(`${fnTag} Failure:`, ex);
      throw new RuntimeError(`${fnTag} Exception:`, ex);
    }
  }

  // checked
  public async enrollAdmin(): Promise<[X509Identity, Wallet]> {
    const fnTag = `${this.className}#enrollAdmin()`;
    try {
      const out = await this.enrollAdminV2({ organization: "org1" });
      return out;
    } catch (ex) {
      this.log.error(`${fnTag} Failure:`, ex);
      throw new RuntimeError(`${fnTag} Exception:`, ex);
    }
  }

  // changed (paths found and added)
  public async getConnectionProfileOrg1(): Promise<any> {
    try {
      // Define the path to your local connection profile JSON
      const localCcpPath = path.resolve(
        os.homedir(),
        "Documents/Program.s/Interoperable-EHR-Management/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
      );

      // Read the connection profile JSON file
      const ccpJson = fs.readFileSync(localCcpPath, "utf8");
      const ccp = JSON.parse(ccpJson);

      // Set the URLs directly (adjust as needed for your setup)
      ccp.peers["peer0.org1.example.com"].url = `grpcs://localhost:8001`;
      if (ccp.peers["peer1.org1.example.com"]) {
        ccp.peers["peer1.org1.example.com"].url = `grpcs://localhost:9001`;
      }
      ccp.certificateAuthorities[
        "ca.org1.example.com"
      ].url = `https://localhost:8004`;

      // orderer information
      ccp.orderers["orderer.example.com"].url = `grpc://localhost:8000`;

      return ccp;
    } catch (error) {
      console.error("Failed to load connection profile:", error);
      throw error;
    }
  }

  // changed (paths found and added)
  public async getConnectionProfileOrgX(orgName: string): Promise<any> {
    const fnTag = `${this.className}:getConnectionProfileOrgX()`;
    this.log.debug(`${fnTag} ENTER - orgName=%s`, orgName);

    const connectionProfilePath =
      orgName === "org1" || orgName === "org2"
        ? path.join(
            os.homedir(),
            "Documents/Program.s/Interoperable-EHR-Management/fabric-samples/test-network",
            "organizations/peerOrganizations",
            `${orgName}.example.com`,
            `connection-${orgName}.json`
          )
        : path.join(
            os.homedir(),
            "Documents/Program.s/Interoperable-EHR-Management/add-org-" +
              orgName,
            "organizations/peerOrganizations",
            `${orgName}.example.com`,
            `connection-${orgName}.json`
          );

    const peer0Name = `peer0.${orgName}.example.com`;
    const peer1Name = `peer1.${orgName}.example.com`;

    try {
      const ccpJsonPath = connectionProfilePath;
      const ccpJson = fs.readFileSync(ccpJsonPath, "utf8");
      const ccp = JSON.parse(ccpJson);

      // Set peer URLs
      ccp.peers[peer0Name].url = `grpc://localhost:8001`;
      if (ccp.peers[peer1Name]) {
        ccp.peers[peer1Name].url = `grpcs://localhost:9001`;
      }

      // Set CA URL based on the organization
      const caName = `ca.${orgName}.example.com`;
      const caPort = orgName === "org1" ? "8004" : "9004";
      ccp.certificateAuthorities[caName].url = `https://localhost:${caPort}`;

      // Set orderer URL and load TLS certificate
      const ordererPemPath = path.resolve(
        os.homedir(),
        "Documents/Program.s/Interoperable-EHR-Management/fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt"
      );

      const pem = fs.readFileSync(ordererPemPath, "utf8");
      ccp.orderers["orderer.example.com"].url = `grpc://localhost:8000`;
      ccp.orderers["orderer.example.com"].tlsCACerts = { pem: pem };

      // Set channel configuration
      const specificPeer = `peer0.${orgName}.example.com`;
      ccp.channels = {
        mychannel: {
          orderers: ["orderer.example.com"],
          peers: {},
        },
      };
      ccp.channels["mychannel"]["peers"][specificPeer] = {
        endorsingPeer: true,
        chaincodeQuery: true,
        ledgerQuery: true,
        eventSource: true,
        discover: true,
      };

      return ccp;
    } catch (ex: unknown) {
      this.log.debug(`getConnectionProfileOrgX() crashed: `, ex);
      const e = ex instanceof Error ? ex : safeStringifyException(ex);
      throw new RuntimeError(`getConnectionProfileOrgX() crashed.`, e);
    }
  }

  // left this doubt
  public async populateFile(
    addOrgXDirectoryPath: string,
    templateType: string,
    orgName: string,
    port: string,
    destinationPath: string
  ): Promise<any> {
    const fnTag = `FabricTestLedger#populateFile()`;
    const { log } = this;
    try {
      log.debug(`${fnTag}: init`);
      const createdFile = {
        body: "",
        filename: "",
        filepath: "",
      };
      const mspId = orgName + "MSP";
      const networkName = "cactusfabrictestnetwork";

      if (port === undefined) {
        throw new Error(`${fnTag} undefined port`);
      }

      //const dockerDirectoryAddOrgX = path.join(addOrgXDirectoryPath, "docker");

      let filename;
      switch (templateType) {
        case "couch":
          filename = `docker-compose-couch-org3.yaml`;
          break;
        case "compose":
          filename = `docker-compose-org3.yaml`;

          break;
        case "ca":
          filename = `docker-compose-ca-org3.yaml`;
          break;
        case "crypto":
          filename = `org3-crypto.yaml`;
          break;
        case "configTxGen":
          filename = `configtx-default.yaml`;
          break;
        case "updateChannelConfig":
          filename = `updateChannelConfig.sh`;
          break;
        default:
          throw new Error(`${fnTag} Template type not defined`);
      }

      const filePath = path.join(addOrgXDirectoryPath, filename);
      const contents = fs.readFileSync(filePath, "utf8");
      log.debug(`${fnTag}: loaded file: ${filename}`);
      const peer0OrgName = `peer0.${orgName}.example.com`;

      switch (templateType) {
        case "couch":
          log.debug(`${fnTag}: entered case couch`);
          //const dataCouch: IDockerFabricComposeCouchDbTemplate = yaml.load(contents);
          const dataCouch: any = yaml.load(contents);
          log.debug(dataCouch);
          //await fs.promises.writeFile("test", dataCouch);

          if (dataCouch === null || dataCouch === undefined) {
            throw new Error(`${fnTag} Could not read yaml`);
          }
          const couchDbName = `couchdb${orgName}`;
          // services: couchdbX:
          dataCouch["services"][couchDbName] =
            dataCouch["services"]["couchdb4"];
          delete dataCouch["services"]["couchdb4"];

          dataCouch["networks"]["test"]["name"] = networkName;

          dataCouch["services"][couchDbName][
            "container_name"
          ] = `couchdb${orgName}`;
          dataCouch["services"][couchDbName]["ports"] = [`${port}:5984`];

          // services: orgX.example.com:
          dataCouch["services"][peer0OrgName] =
            dataCouch["services"]["peer0.org3.example.com"];

          dataCouch["services"][peer0OrgName][
            "environment"
          ][1] = `CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=${couchDbName}:5984`;

          dataCouch["services"][peer0OrgName]["depends_on"] = [couchDbName];

          delete dataCouch["services"]["peer0.org3.example.com"];
          log.debug(dataCouch);

          const dumpCouch = yaml.dump(dataCouch, {
            flowLevel: -1,
            quotingType: '"',
            styles: {
              "!!int": "decimal",
              "!!null": "camelcase",
            },
          });

          createdFile.filename = `docker-compose-couch-${orgName}.yaml`;
          createdFile.filepath = path.join(
            destinationPath,
            createdFile.filename
          );
          createdFile.body = dumpCouch;
          await fs.promises.writeFile(createdFile.filepath, createdFile.body);

          log.debug(`Created file at ${createdFile.filepath}`);
          log.debug(`docker/docker-compose-couch-${orgName}.yaml`);
          return createdFile;

        case "compose":
          log.debug(`${fnTag}: entered case compose`);
          const dataCompose: any = yaml.load(contents);
          if (dataCompose === null || dataCompose === undefined) {
            throw new Error(`${fnTag} Could not read yaml`);
          }

          log.debug("dataCompose: \n");
          log.debug(dataCompose);
          // l.9: volume name;  peer0.org3.example.com:
          dataCompose["volumes"][peer0OrgName] = null;
          delete dataCompose["volumes"]["peer0.org3.example.com"];

          //dataCompose["volumes"][orgName] = null;
          // l. 17: org name
          dataCompose["services"][peer0OrgName] =
            dataCompose["services"]["peer0.org3.example.com"];
          delete dataCompose["services"]["peer0.org3.example.com"];

          // Delete label
          delete dataCompose["networks"]["test"]["name"];
          //dataCompose['networks']['test']['name'] = networkName;
          //dataCompose["networks"]["test"] = null;
          delete dataCompose["services"][peer0OrgName]["labels"];

          //l.18: container name
          dataCompose["services"][peer0OrgName]["container_name"] =
            peer0OrgName;

          //       - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=cactusfabrictestnetwork_test

          dataCompose["services"][peer0OrgName][
            "environment"
          ][1] = `CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=${networkName}`;

          // CORE_PEER_ID=peer0.org3.example.com
          dataCompose["services"][peer0OrgName][
            "environment"
          ][8] = `CORE_PEER_ID=${peer0OrgName}`;

          // CORE_PEER_ADDRESS=peer0.org3.example.com:11051
          dataCompose["services"][peer0OrgName][
            "environment"
          ][9] = `CORE_PEER_ADDRESS=${peer0OrgName}:${port}`;

          // CORE_PEER_LISTENADDRESS=0.0.0.0:11051
          dataCompose["services"][peer0OrgName][
            "environment"
          ][10] = `CORE_PEER_LISTENADDRESS=0.0.0.0:${port}`;

          //       - CORE_PEER_CHAINCODEADDRESS=peer0.org3.example.com:11052
          const chaincodePort = parseInt(port) + 1;
          dataCompose["services"][peer0OrgName][
            "environment"
          ][11] = `CORE_PEER_CHAINCODEADDRESS=${peer0OrgName}:${chaincodePort}`;

          //    CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:11052
          dataCompose["services"][peer0OrgName][
            "environment"
          ][12] = `CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:${chaincodePort}`;

          //          - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org3.example.com:11051
          dataCompose["services"][peer0OrgName][
            "environment"
          ][13] = `CORE_PEER_GOSSIP_BOOTSTRAP=${peer0OrgName}:${port}`;

          //          -       - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org3.example.com:11051

          dataCompose["services"][peer0OrgName][
            "environment"
          ][14] = `CORE_PEER_GOSSIP_EXTERNALENDPOINT=${peer0OrgName}:${port}`;

          //            - CORE_PEER_LOCALMSPID=Org3MSP

          dataCompose["services"][peer0OrgName][
            "environment"
          ][15] = `CORE_PEER_LOCALMSPID=${mspId}`;

          /*
          dataCompose["services"][peer0OrgName][
            "environment"
          ][16] = `COMPOSE_PROJECT_NAME=${networkName}`;

          */

          /// Volumes
          //         - ../../organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/msp:/etc/hyperledger/fabric/msp
          dataCompose["services"][peer0OrgName][
            "volumes"
          ][1] = `/add-org-${orgName}/organizations/peerOrganizations/${orgName}.example.com/peers/peer0.${orgName}.example.com/msp:/etc/hyperledger/fabric/msp`;

          //        - ../../organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls:/etc/hyperledger/fabric/tls
          dataCompose["services"][peer0OrgName][
            "volumes"
          ][2] = `/add-org-${orgName}/organizations/peerOrganizations/${orgName}.example.com/peers/peer0.${orgName}.example.com/tls:/etc/hyperledger/fabric/tls`;

          //         - peer0.org3.example.com:/var/hyperledger/production
          dataCompose["services"][peer0OrgName][
            "volumes"
          ][3] = `${peer0OrgName}:/var/hyperledger/production`;

          dataCompose["services"][peer0OrgName]["ports"] = [`${port}:${port}`];

          log.debug("dataCompose after modifications: \n");
          log.debug(dataCompose);
          const dumpCompose = yaml.dump(dataCompose, {
            flowLevel: -1,
            quotingType: '"',
            styles: {
              "!!int": "decimal",
              "!!null": "camelcase",
            },
          });

          const nullRegex = new RegExp(/Null/g);
          const newCompose = dumpCompose.replace(nullRegex, "");

          createdFile.filename = `docker-compose-${orgName}.yaml`;
          createdFile.filepath = path.join(
            destinationPath,
            createdFile.filename
          );
          createdFile.body = newCompose;

          await fs.promises.writeFile(createdFile.filepath, createdFile.body);

          log.debug(`Created file at ${createdFile.filepath}`);
          log.debug(`docker/docker-compose-${orgName}.yaml`);

          return createdFile;

        case "ca":
          log.info(`${fnTag}: entered case ca`);
          const dataCa: any = yaml.load(contents);
          if (dataCa === null || dataCa === undefined) {
            throw new Error(`${fnTag} Could not read yaml`);
          }
          log.debug("dataCa: \n");
          log.debug(dataCa);

          const caName = `ca_${orgName}`;
          dataCa["services"][caName] = dataCa["services"]["ca_org3"];
          delete dataCa["services"]["ca_org3"];

          //      - FABRIC_CA_SERVER_CA_NAME=ca-org3
          dataCa["services"][caName][
            "environment"
          ][1] = `FABRIC_CA_SERVER_CA_NAME=${caName}`;

          //      - FABRIC_CA_SERVER_PORT=11054
          dataCa["services"][caName][
            "environment"
          ][3] = `FABRIC_CA_SERVER_PORT=${port}`;

          //      - "11054:11054"
          dataCa["services"][caName]["ports"] = [`${port}:${port}`];

          dataCa["services"][caName]["volumes"] = [
            `../fabric-ca/${orgName}:/etc/hyperledger/fabric-ca-server`,
          ];

          dataCa["services"][caName]["container_name"] = caName;

          log.debug("dataCa after modifications: \n");
          log.debug(dataCa);
          const dumpCa = yaml.dump(dataCa, {
            flowLevel: -1,
            quotingType: '"',
            styles: {
              "!!int": "decimal",
              "!!null": "camelcase",
            },
          });

          createdFile.filename = `docker-compose-ca-${orgName}.yaml`;
          createdFile.filepath = path.join(
            destinationPath,
            createdFile.filename
          );
          createdFile.body = dumpCa;
          log.debug(`Created file at ${createdFile.filepath}`);
          log.debug(`docker/docker-compose-ca-${orgName}.yaml`);
          await fs.promises.writeFile(createdFile.filepath, createdFile.body);

          return createdFile;
        case "crypto":
          log.info(`${fnTag}: entered case crypto`);
          const dataCrypto: any = yaml.load(contents);
          if (dataCrypto === null || dataCrypto === undefined) {
            throw new Error(`${fnTag} Could not read yaml`);
          }
          log.debug("dataCrypto: \n");
          log.debug(dataCrypto);
          dataCrypto["PeerOrgs"][0]["Name"] = orgName;
          dataCrypto["PeerOrgs"][0]["Domain"] = `${orgName}.example.com`;

          log.debug("dataCrypto after modifications: \n");
          log.debug(dataCrypto);
          const dumpCrypto = yaml.dump(dataCrypto, {
            flowLevel: -1,
            quotingType: '"',
            styles: {
              "!!int": "decimal",
              "!!null": "camelcase",
            },
          });

          createdFile.filename = `${orgName}-crypto.yaml`;
          createdFile.filepath = path.join(
            destinationPath,
            createdFile.filename
          );
          createdFile.body = dumpCrypto;
          log.debug(`Created file at ${createdFile.filepath}`);
          log.debug(createdFile.filename);
          await fs.promises.writeFile(createdFile.filepath, createdFile.body);

          return createdFile;
        case "configTxGen":
          log.info(`${fnTag}: entered case configTxGen`);
          const loadOptions = {
            json: true,
          };
          const dataConfigTxGen: any = yaml.load(contents, loadOptions);
          if (dataConfigTxGen === null || dataConfigTxGen === undefined) {
            throw new Error(`${fnTag} Could not read yaml`);
          }
          log.debug("dataConfigTxGen: \n");
          log.debug(dataConfigTxGen);

          // how to map     - &Org3
          // workaround: define a variable TO_REPLACE, and then manually replace that for the necessary reference
          //dataConfigTxGen["Organizations"][orgName] = dataConfigTxGen["Organizations"];
          dataConfigTxGen["Organizations"][0]["Name"] = mspId;
          dataConfigTxGen["Organizations"][0]["ID"] = mspId;
          dataConfigTxGen["Organizations"][0][
            "MSPDir"
          ] = `organizations/peerOrganizations/${orgName}.example.com/msp`;
          dataConfigTxGen["Organizations"][0]["Policies"]["Readers"][
            "Rule"
          ] = `OR('${mspId}.admin','${mspId}.peer','${mspId}.client')`;

          dataConfigTxGen["Organizations"][0]["Policies"]["Writers"][
            "Rule"
          ] = `OR('${mspId}.admin','${mspId}.client')`;
          dataConfigTxGen["Organizations"][0]["Policies"]["Admins"][
            "Rule"
          ] = `OR('${mspId}.admin')`;
          dataConfigTxGen["Organizations"][0]["Policies"]["Endorsement"][
            "Rule"
          ] = `OR('${mspId}.peer')`;

          log.debug("dataConfigTxGen after modifications: \n");
          log.debug(dataConfigTxGen);

          log.debug("dataConfigTxGen after modifications: \n");
          log.debug(dataConfigTxGen);

          const dumpConfigTxGen = yaml.dump(dataConfigTxGen, {
            flowLevel: -1,
            quotingType: '"',
            styles: {
              "!!int": "decimal",
              "!!null": "camelcase",
            },
          });

          // TODO
          const regexOrOpening = new RegExp(/OR/g);
          let replacedConfigTx = dumpConfigTxGen.replace(regexOrOpening, '"OR');

          const regexOrClosing = new RegExp(/\)/g);
          replacedConfigTx = replacedConfigTx.replace(regexOrClosing, ')"');

          const regexName = new RegExp(/Name:/g);
          replacedConfigTx = replacedConfigTx.replace(
            regexName,
            `&${orgName}\n    Name: `
          );

          log.debug(replacedConfigTx);

          // const readersCloseRegEx = new RegExp("')");
          //dumpConfigTxGen.replace(readersCloseRegEx, "')\"");

          createdFile.filename = `configtx.yaml`;
          createdFile.filepath = path.join(
            destinationPath,
            createdFile.filename
          );
          createdFile.body = replacedConfigTx;
          log.debug(`Created file at ${createdFile.filepath}`);
          log.debug(createdFile.filename);
          await fs.promises.writeFile(createdFile.filepath, createdFile.body);

          return createdFile;

        default:
          this.log.error(`${fnTag} template type not found`);
          throw new Error(`${fnTag} template type not found`);
      }
    } catch (error) {
      this.log.error(`populateFile() crashed: `, error);
      throw new Error(`${fnTag} Unable to run transaction: ${error}`);
    }
  }

  // checked
  public async addExtraOrgs(): Promise<void> {
    const fnTag = `FabricTestLedger#addOrgX()`;
    const { log } = this;
    if (!this.extraOrgs) {
      throw new Error(`${fnTag}: there are no extra orgs`);
    }

    log.debug(`
    Adding ${this.extraOrgs.length} orgs`);
    for (let i = 0; i < this.extraOrgs.length; i++) {
      await this.addOrgX(
        this.extraOrgs[i].path,
        this.extraOrgs[i].orgName,
        this.extraOrgs[i].orgChannel,
        this.extraOrgs[i].certificateAuthority,
        this.extraOrgs[i].stateDatabase,
        this.extraOrgs[i].port
      );
    }
  }

  // checked but doubt
  // req: AddOrganizationFabricV2Request
  // returns promise <AddOrganizationFabricV2Response>
  public async addOrgX(
    addOrgXDirectoryPath: string,
    orgName: string,
    channel = "mychannel",
    certificateAuthority: boolean,
    database: string,
    peerPort = "11051" // check the port
  ): Promise<void> {
    const fnTag = `FabricTestLedger#addOrgX()`;
    const { log } = this;
    log.debug(`
    Adding ${orgName} on ${channel}, with state database ${database}.
    Certification authority: ${certificateAuthority}.
    Default port: ${peerPort}
    Path to original source files: ${addOrgXDirectoryPath}`);

    if (certificateAuthority) {
      throw new Error("Adding orgs with CA enabled is not currently supported");
    }

    if (this.stateDatabase !== database) {
      log.warn(
        "Adding an organization with a different state database than org1 and org2"
      );
    }

    const peerPortNumber = Number(peerPort);
    const mspId = orgName + "MSP";

    const ssh = new NodeSSH();
    const sshConfig = await this.getSshConfig();
    await ssh.connect(sshConfig);
    log.debug(`SSH connection OK`);

    try {
      if (peerPortNumber < 1024) {
        throw new Error(`${fnTag} Invalid port, port too small`);
      }
      const couchDbPort = Math.abs(peerPortNumber - 1067).toString();
      const caPort = (peerPortNumber + 3).toString();

      temp.track();

      const tmpDirPrefix = `hyperledger-cactus-${this.className}-${this.containerId}`;
      const tmpDirPath = temp.mkdirSync(tmpDirPrefix);
      const dockerPath = path.join(addOrgXDirectoryPath, "docker");
      fs.mkdirSync(dockerPath, { recursive: true });

      const couchdbFile = await this.populateFile(
        dockerPath,
        "couch",
        orgName,
        couchDbPort,
        tmpDirPath
      );

      const caFile = await this.populateFile(
        dockerPath,
        "ca",
        orgName,
        caPort,
        tmpDirPath
      );

      const composeFile = await this.populateFile(
        dockerPath,
        "compose",
        orgName,
        peerPort,
        tmpDirPath
      );

      const cryptoFile = await this.populateFile(
        addOrgXDirectoryPath,
        "crypto",
        orgName,
        peerPort,
        tmpDirPath
      );

      const configTxGenFile = await this.populateFile(
        addOrgXDirectoryPath,
        "configTxGen",
        orgName,
        peerPort,
        tmpDirPath
      );

      const sourceFiles = [
        couchdbFile,
        caFile,
        composeFile,
        cryptoFile,
        configTxGenFile,
      ];

      Checks.truthy(sourceFiles, `${fnTag}:sourceFiles`);
      Checks.truthy(Array.isArray(sourceFiles), `${fnTag}:sourceFiles array`);

      for (const sourceFile of sourceFiles) {
        const { filename, filepath, body } = sourceFile;
        const relativePath = filepath || "./";
        const subDirPath = path.join(tmpDirPath, relativePath);
        fs.mkdirSync(subDirPath, { recursive: true });
        const localFilePath = path.join(subDirPath, filename);
        fs.writeFileSync(localFilePath, body, "base64");
      }

      const remoteDirPath = path.join("/", "add-org-" + orgName);
      log.debug(`SCP from/to %o => %o`, addOrgXDirectoryPath, remoteDirPath);
      await ssh.putDirectory(addOrgXDirectoryPath, remoteDirPath);
      log.debug(`SCP OK %o`, remoteDirPath);

      log.debug(`SCP from/to %o => %o`, tmpDirPath, remoteDirPath);
      await ssh.putDirectory(tmpDirPath, remoteDirPath, { concurrency: 1 });
      log.debug(`SCP OK %o`, remoteDirPath);

      log.debug(`Initializing docker commands`);

      const envVarsList = {
        VERBOSE: "true",
        PATH: "$PATH:/fabric-samples/bin",
        GO111MODULE: "on",
        FABRIC_CFG_PATH: `/add-org-${orgName}`,
        FABRIC_LOGGING_SPEC: "DEBUG",
        CHANNEL_NAME: channel,
        CLI_TIMEOUT: 300,
        CLI_DELAY: 15,
        MAX_RETRY: 5,
        ORG_NAME: orgName,
        ORG_MSPID: mspId,
        DATABASE: database,
        CA: certificateAuthority,
        NEW_ORG_PORT: peerPort,
        COUCH_DB_PORT: couchDbPort,
        CA_PORT: caPort,
        CONFIG_TX_GEN_PATH: path.join(remoteDirPath),
        COMPOSE_FILE_COUCH: path.join(remoteDirPath, couchdbFile.filename),
        COMPOSE_FILE: path.join(remoteDirPath, composeFile.filename),
        COMPOSE_FILE_CA: path.join(remoteDirPath, caFile.filename),
        //COMPOSE_PROJECT_NAME: "cactusfabrictestnetwork_test",
      };

      log.debug("envVars list:");
      log.debug(envVarsList);

      console.log(composeFile);
      const sshCmdOptionsDocker: SSHExecCommandOptions = {
        execOptions: {
          pty: true,
        },
        cwd: remoteDirPath,
      };

      const envVars = Object.entries(envVarsList)
        .map(([key, value]) => `${key}=${value}`)
        .join(" ");

      log.debug("envVars loading command:");
      log.debug(envVars);

      {
        const label = "give permissions to files";
        const cmd = `chmod 777 -R *`;
        const response = await this.sshExec(
          cmd,
          label,
          ssh,
          sshCmdOptionsDocker
        );
        log.debug(`${label} executed: ${JSON.stringify(response)}`);
      }

      {
        const label = "execute add org script";
        const cmd = certificateAuthority
          ? `${envVars} ./addOrgX.sh up -ca`
          : `${envVars} ./addOrgX.sh up`;
        const response = await this.sshExec(
          cmd,
          label,
          ssh,
          sshCmdOptionsDocker
        );
        log.debug(`${label} executed: ${response.stdout}`);
      }

      this.orgList.push(orgName);
    } catch (error) {
      this.log.error(`addOrgX() crashed: `, error);
      throw new Error(`${fnTag} Unable to run transaction: ${error}`);
    } finally {
      try {
        ssh.dispose();
      } finally {
        temp.cleanup();
      }
    }
  }

  // changed (path found and added)
  public async getSshConfig(): Promise<SshConfig> {
    const fnTag = "FabricTestLedger#getSshConnectionOptions()";

    const homeDir = os.homedir();
    const privateKeyPath =
      process.env.SSH_PRIVATE_KEY_PATH ||
      path.join(homeDir, ".ssh/id_rsa_4096");
    const sshPort = parseInt(process.env.SSH_PORT || "22", 10);
    const sshHost = process.env.SSH_HOST || "localhost";
    const sshUsername = process.env.SSH_USERNAME || os.userInfo().username;

    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    this.log.debug(
      `${fnTag} - Reading SSH private key from path: ${privateKeyPath}`
    );
    const sshConfig: SshConfig = {
      host: sshHost,
      privateKey: privateKey,
      username: sshUsername,
      port: sshPort,
    };

    return sshConfig;
  }

  // checked
  private async sshExec(
    cmd: string,
    label: string,
    ssh: NodeSSH,
    sshCmdOptions: SSHExecCommandOptions
  ): Promise<SSHExecCommandResponse> {
    this.log.debug(`${label} CMD: ${cmd}`);
    const cmdRes = await ssh.execCommand(cmd, sshCmdOptions);
    this.log.debug(`${label} CMD Response: %o`, cmdRes);
    Checks.truthy(cmdRes.code === null, `${label} cmdRes.code === null`);
    return cmdRes;
  }
}
