import { Express, Request, Response } from "express";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { IEndpointAuthzOptions, IExpressRequestHandler, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { DefaultApi as FabricApi } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import OAS from "../../../json/openapi.json";
export interface IListDataHspBOptions {
    readonly logLevel?: LogLevelDesc;
    readonly fabricApi: FabricApi;
    readonly keychainId: string;
}
export declare class ListDataHspB implements IWebServiceEndpoint {
    readonly opts: IListDataHspBOptions;
    static readonly CLASS_NAME = "ListDataEndpoint";
    private readonly log;
    private readonly keychainId;
    get className(): string;
    getOasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cactus-healthcare-backend/list-patient-hspb"];
    getPath(): string;
    getVerbLowerCase(): string;
    getOperationId(): string;
    constructor(opts: IListDataHspBOptions);
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    getExpressRequestHandler(): IExpressRequestHandler;
    handleRequest(req: Request, res: Response): Promise<void>;
}
