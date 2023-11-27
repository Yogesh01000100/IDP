"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertDataHspA = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_plugin_ledger_connector_fabric_1 = require("@hyperledger/cactus-plugin-ledger-connector-fabric");
const openapi_json_1 = __importDefault(require("../../../json/openapi.json"));
class InsertDataHspA {
    get className() {
        return InsertDataHspA.CLASS_NAME;
    }
    constructor(opts) {
        this.opts = opts;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(opts, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(opts.fabricApi, `${fnTag} options.fabricApi`);
        cactus_common_1.Checks.truthy(opts.keychainId, `${fnTag} options.keychain`);
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
    getOasPath() {
        return openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-healthcare-backend/insert-patient-hspa"];
    }
    getPath() {
        const apiPath = this.getOasPath();
        return apiPath.post["x-hyperledger-cactus"].http.path;
    }
    getVerbLowerCase() {
        const apiPath = this.getOasPath();
        return apiPath.post["x-hyperledger-cactus"].http.verbLowerCase;
    }
    getOperationId() {
        return this.getOasPath().post.operationId;
    }
    getExpressRequestHandler() {
        return this.handleRequest.bind(this);
    }
    async handleRequest(req, res) {
        // main handling of the req for creating patient data
        const tag = `${this.getVerbLowerCase().toUpperCase()} ${this.getPath()}`;
        try {
            const { data } = req.body;
            this.log.debug(`${tag} %o`, data);
            const request = {
                signingCredential: {
                    keychainId: this.keychainId,
                    keychainRef: "user2",
                },
                channelName: "mychannel",
                contractName: "EHRContract",
                invocationType: cactus_plugin_ledger_connector_fabric_1.FabricContractInvocationType.Send,
                methodName: "CreatePatientRecord",
                params: [data.id, data.HIdB], // here the chaincode has to be updated in order to match the param structure
            };
            const { data: { functionOutput }, } = await this.opts.fabricApi.runTransactionV1(request);
            const body = { functionOutput };
            res.json(body);
            res.status(200);
        }
        catch (ex) {
            const exStr = (0, cactus_common_1.safeStringifyException)(ex);
            this.log.debug(`${tag} Failed to serve request:`, ex);
            res.status(500);
            res.json({ error: exStr });
        }
    }
}
exports.InsertDataHspA = InsertDataHspA;
InsertDataHspA.CLASS_NAME = "InsertDataHspA";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zZXJ0LXBhdGllbnQtaHNwYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvYnVzaW5lc3MtbG9naWMtcGx1Z2luL3dlYi1zZXJ2aWNlcy9pbnNlcnQtcGF0aWVudC1oc3BhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLDhEQU9vQztBQU1wQywwREFBc0U7QUFFdEUsOEdBSTREO0FBRTVELDhFQUE2QztBQVE3QyxNQUFhLGNBQWM7SUFLekIsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sY0FBYyxDQUFDLFVBQVUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsWUFBNEIsSUFBNEI7UUFBNUIsU0FBSSxHQUFKLElBQUksQ0FBd0I7UUFDdEQsTUFBTSxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsQ0FBQztRQUNoRCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLGNBQWMsQ0FBQyxDQUFDO1FBQzVDLHNCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxLQUFLLG9CQUFvQixDQUFDLENBQUM7UUFDNUQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEtBQUssbUJBQW1CLENBQUMsQ0FBQztRQUM1RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUM7UUFDM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLDhCQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3BDLENBQUM7SUFFRCwrQkFBK0I7UUFDN0IsOERBQThEO1FB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