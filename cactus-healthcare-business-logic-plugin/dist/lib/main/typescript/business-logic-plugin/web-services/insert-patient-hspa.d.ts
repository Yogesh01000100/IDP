import { Express, Request, Response } from "express";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { IEndpointAuthzOptions, IExpressRequestHandler, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { DefaultApi as FabricApi } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import OAS from "../../../json/openapi.json";
export interface IInsertDataHspAOptions {
    logLevel?: LogLevelDesc;
    fabricApi: FabricApi;
    keychainId: string;
}
export declare class InsertDataHspA implements IWebServiceEndpoint {
    readonly opts: IInsertDataHspAOptions;
    static readonly CLASS_NAME = "InsertDataHspA";
    private readonly log;
    private readonly keychainId;
    get className(): string;
    constructor(opts: IInsertDataHspAOptions);
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    getOasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cactus-healthcare-backend/insert-patient-hspa"];
    getPath(): string;
    getVerbLowerCase(): string;
    getOperationId(): string;
    getExpressRequestHandler(): IExpressRequestHandler;
    handleRequest(req: Request, res: Response): Promise<void>;
}
