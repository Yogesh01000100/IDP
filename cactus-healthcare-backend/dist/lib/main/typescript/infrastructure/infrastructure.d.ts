/// <reference types="node" />
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { DefaultApi as FabricApi, DeploymentTargetOrgFabric2x, PluginLedgerConnectorFabric } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
export declare const org1Env: {
    CORE_PEER_LOCALMSPID: string;
    CORE_PEER_ADDRESS: string;
    CORE_PEER_MSPCONFIGPATH: string;
    CORE_PEER_TLS_ROOTCERT_FILE: string;
    ORDERER_TLS_ROOTCERT_FILE: string;
};
export declare const org2Env: {
    CORE_PEER_LOCALMSPID: string;
    CORE_PEER_ADDRESS: string;
    CORE_PEER_MSPCONFIGPATH: string;
    CORE_PEER_TLS_ROOTCERT_FILE: string;
    ORDERER_TLS_ROOTCERT_FILE: string;
};
export declare const org3Env: {
    CORE_PEER_LOCALMSPID: string;
    CORE_PEER_ADDRESS: string;
    CORE_PEER_MSPCONFIGPATH: string;
    CORE_PEER_TLS_ROOTCERT_FILE: string;
    ORDERER_TLS_ROOTCERT_FILE: string;
};
export declare const org4Env: {
    CORE_PEER_LOCALMSPID: string;
    CORE_PEER_ADDRESS: string;
    CORE_PEER_MSPCONFIGPATH: string;
    CORE_PEER_TLS_ROOTCERT_FILE: string;
    ORDERER_TLS_ROOTCERT_FILE: string;
};
export interface IHealthCareInfrastructureOptions {
    logLevel?: LogLevelDesc;
}
export declare class HealthCareAppDummyInfrastructure {
    readonly options: IHealthCareInfrastructureOptions;
    static readonly CLASS_NAME = "HealthCareAppDummyInfrastructure";
    static readonly FABRIC_2_AIO_CLI_CFG_DIR = "/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/";
    private readonly fabric1;
    private readonly fabric2;
    private readonly log;
    get className(): string;
    get orgCfgDir(): string;
    constructor(options: IHealthCareInfrastructureOptions);
    get org1Env(): NodeJS.ProcessEnv & DeploymentTargetOrgFabric2x;
    get org2Env(): NodeJS.ProcessEnv & DeploymentTargetOrgFabric2x;
    get org3Env(): NodeJS.ProcessEnv & DeploymentTargetOrgFabric2x;
    get org4Env(): NodeJS.ProcessEnv & DeploymentTargetOrgFabric2x;
    start(): Promise<void>;
    stop(): Promise<void>;
    createFabric1LedgerConnector(): Promise<PluginLedgerConnectorFabric>;
    createFabric2LedgerConnector(): Promise<PluginLedgerConnectorFabric>;
    deployFabricContract1(fabricApiClient: FabricApi): Promise<void>;
}
