"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDataHspB = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_plugin_ledger_connector_fabric_1 = require("@hyperledger/cactus-plugin-ledger-connector-fabric");
const openapi_json_1 = __importDefault(require("../../../json/openapi.json")); // to be updated
class ListDataHspB {
    get className() {
        return ListDataHspB.CLASS_NAME;
    }
    getOasPath() {
        return openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-healthcare-backend/list-patient-hspb"];
    }
    getPath() {
        const apiPath = this.getOasPath();
        return apiPath.get["x-hyperledger-cacti"].http.path;
    }
    getVerbLowerCase() {
        const apiPath = this.getOasPath();
        return apiPath.get["x-hyperledger-cacti"].http.verbLowerCase;
    }
    getOperationId() {
        return this.getOasPath().get.operationId;
    }
    constructor(opts) {
        this.opts = opts;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(opts, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(opts.fabricApi, `${fnTag} options.fabricApi`);
        cactus_common_1.Checks.truthy(opts.keychainId, `${fnTag} options.keychainId`);
        const level = this.opts.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
        this.keychainId = opts.keychainId;
    }
    getAuthorizationOptionsProvider() {
        // TODO: make this an injectable dependency in the constructor
        return {
            get: async () => ({
                isProtected: true,
                requiredRoles: [],
            }),
        };
    }
    async registerExpress(expressApp) {
        await (0, cactus_core_1.registerWebServiceEndpoint)(expressApp, this);
        return this;
    }
    getExpressRequestHandler() {
        return this.handleRequest.bind(this);
    }
    async handleRequest(req, res) {
        const tag = `${this.getVerbLowerCase().toUpperCase()} ${this.getPath()}`;
        try {
            this.log.debug(`${tag}`);
            const request = {
                signingCredential: {
                    keychainId: this.keychainId,
                    keychainRef: "userA",
                },
                channelName: "mychannel",
                contractName: "EHRContract",
                invocationType: cactus_plugin_ledger_connector_fabric_1.FabricContractInvocationType.Call,
                methodName: "GetAllPatientRecords",
                params: [], // pass the ID of the patient
            };
            const { data: { functionOutput }, } = await this.opts.fabricApi.runTransactionV1(request);
            const output = JSON.parse(functionOutput);
            const body = { data: output };
            res.status(200);
            res.json(body);
        }
        catch (ex) {
            const exStr = (0, cactus_common_1.safeStringifyException)(ex);
            this.log.debug(`${tag} Failed to serve request:`, ex);
            res.status(500);
            res.json({ error: exStr });
        }
    }
}
exports.ListDataHspB = ListDataHspB;
ListDataHspB.CLASS_NAME = "ListDataEndpoint";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1wYXRpZW50LWhzcGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2J1c2luZXNzLWxvZ2ljLXBsdWdpbi93ZWItc2VydmljZXMvbGlzdC1wYXRpZW50LWhzcGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsOERBT29DO0FBTXBDLDBEQUFzRTtBQUV0RSw4R0FJNEQ7QUFFNUQsOEVBQTZDLENBQUMsZ0JBQWdCO0FBUTlELE1BQWEsWUFBWTtJQUt2QixJQUFXLFNBQVM7UUFDbEIsT0FBTyxZQUFZLENBQUMsVUFBVSxDQUFDO0lBQ2pDLENBQUM7SUFFTSxVQUFVO1FBQ2YsT0FBTyxzQkFBRyxDQUFDLEtBQUssQ0FDZCwwRUFBMEUsQ0FDM0UsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPO1FBQ0wsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDdEQsQ0FBQztJQUVELGdCQUFnQjtRQUNkLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQy9ELENBQUM7SUFFTSxjQUFjO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7SUFDM0MsQ0FBQztJQUVELFlBQTRCLElBQTBCO1FBQTFCLFNBQUksR0FBSixJQUFJLENBQXNCO1FBQ3BELE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsZ0JBQWdCLENBQUM7UUFDaEQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxjQUFjLENB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