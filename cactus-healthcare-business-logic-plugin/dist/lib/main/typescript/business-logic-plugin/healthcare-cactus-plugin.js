"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCareCactusPlugin = void 0;
/* eslint-disable prettier/prettier */
const openapi_json_1 = __importDefault(require("../../json/openapi.json")); // to be done
const cactus_common_1 = require("@hyperledger/cactus-common");
//import { IHealthCareContractDeploymentInfo } from "../i-healthcare-contract-deployment-info";
const insert_patient_hspa_1 = require("./web-services/insert-patient-hspa");
const list_patient_hspa_1 = require("./web-services/list-patient-hspa");
const list_patient_hspb_1 = require("./web-services/list-patient-hspb");
const crypto_material_json_1 = __importDefault(require("../../../crypto-material/crypto-material.json"));
class HealthCareCactusPlugin {
    get className() {
        return HealthCareCactusPlugin.CLASS_NAME;
    }
    constructor(options) {
        this.options = options;
        const fnTag = `${this.className}#constructor`;
        cactus_common_1.Checks.truthy(options, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(options.instanceId, `${fnTag} arg options.instanceId`);
        cactus_common_1.Checks.nonBlankString(options.instanceId, `${fnTag} options.instanceId`);
        //Checks.truthy(options.contracts, `${fnTag} arg options.contracts`); // watch for contract variable
        cactus_common_1.Checks.truthy(options.fabricApiClient1, `${fnTag} arg options.fabricApiClient1`);
        cactus_common_1.Checks.truthy(options.fabricApiClient2, `${fnTag} arg options.fabricApiClient2`);
        const level = this.options.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
        this.instanceId = options.instanceId;
    }
    getOpenApiSpec() {
        return openapi_json_1.default;
    }
    async registerWebServices(app) {
        const webServices = await this.getOrCreateWebServices();
        await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
        return webServices;
    }
    async getOrCreateWebServices() {
        if (Array.isArray(this.endpoints)) {
            return this.endpoints;
        }
        // Endpoints for network 1
        const insertDataOrg1 = new insert_patient_hspa_1.InsertDataHspA({
            logLevel: this.options.logLevel,
            fabricApi: this.options.fabricApiClient1,
            keychainId: crypto_material_json_1.default.keychains.keychain1.id
        });
        const listDataOrg1 = new list_patient_hspa_1.ListDataHspA({
            logLevel: this.options.logLevel,
            fabricApi: this.options.fabricApiClient1,
            keychainId: crypto_material_json_1.default.keychains.keychain1.id
        });
        // Endpoints for network 2
        const listDataOrg2 = new list_patient_hspb_1.ListDataHspB({
            logLevel: this.options.logLevel,
            fabricApi: this.options.fabricApiClient2,
            keychainId: crypto_material_json_1.default.keychains.keychain2.id // contract variable
        });
        this.endpoints = [
            insertDataOrg1,
            listDataOrg1,
            listDataOrg2,
        ];
        return this.endpoints;
    }
    async shutdown() {
        this.log.info(`Shutting down ${this.className}...`);
    }
    getInstanceId() {
        return this.instanceId;
    }
    getPackageName() {
        return "@hyperledger/cactus-healthcare-backend";
    }
    async onPluginInit() {
        return;
    }
}
exports.HealthCareCactusPlugin = HealthCareCactusPlugin;
HealthCareCactusPlugin.CLASS_NAME = "HealthCareCactusPlugin";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoY2FyZS1jYWN0dXMtcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9idXNpbmVzcy1sb2dpYy1wbHVnaW4vaGVhbHRoY2FyZS1jYWN0dXMtcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNDQUFzQztBQUN0QywyRUFBMEMsQ0FBQSxhQUFhO0FBS3ZELDhEQUtvQztBQVNwQywrRkFBK0Y7QUFFL0YsNEVBQW9FO0FBQ3BFLHdFQUFnRTtBQUNoRSx3RUFBZ0U7QUFDaEUseUdBQTJFO0FBa0IzRSxNQUFhLHNCQUFzQjtJQVVqQyxJQUFXLFNBQVM7UUFDbEIsT0FBTyxzQkFBc0IsQ0FBQyxVQUFVLENBQUM7SUFDM0MsQ0FBQztJQUVELFlBQTRCLE9BQXVDO1FBQXZDLFlBQU8sR0FBUCxPQUFPLENBQWdDO1FBQ2pFLE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsY0FBYyxDQUFDO1FBRTlDLHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssY0FBYyxDQUFDLENBQUM7UUFDL0Msc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLEtBQUsseUJBQXlCLENBQUMsQ0FBQztRQUNyRSxzQkFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsS0FBSyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3pFLG9HQUFvRztRQUNwRyxzQkFBTSxDQUFDLE1BQU0sQ0FDWCxPQUFPLENBQUMsZ0JBQWdCLEVBQ3hCLEdBQUcsS0FBSywrQkFBK0IsQ0FDeEMsQ0FBQztRQUNGLHNCQUFNLENBQUMsTUFBTSxDQUNYLE9BQU8sQ0FBQyxnQkFBZ0IsRUFDeEIsR0FBRyxLQUFLLCtCQUErQixDQUN4QyxDQUFDO1FBRUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO1FBQzlDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUN2QyxDQUFDO0lBRU0sY0FBYztRQUNuQixPQUFPLHNCQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEdBQVk7UUFDcEMsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUN4RCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVNLEtBQUssQ0FBQyxzQkFBc0I7UUFDakMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNqQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDdkI7UUFFRCwwQkFBMEI7UUFDMUIsTUFBTSxjQUFjLEdBQUcsSUFBSSxvQ0FBYyxDQUFDO1lBQ3hDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7WUFDL0IsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCO1lBQ3hDLFVBQVUsRUFBRSw4QkFBYyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtTQUNsRCxDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLGdDQUFZLENBQUM7WUFDcEMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTtZQUMvQixTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7WUFDeEMsVUFBVSxFQUFFLDhCQUFjLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1NBQ2xELENBQUMsQ0FBQztRQUVILDBCQUEwQjtRQUUxQixNQUFNLFlBQVksR0FBRyxJQUFJLGdDQUFZLENBQUM7WUFDcEMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTtZQUMvQixTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7WUFDeEMsVUFBVSxFQUFFLDhCQUFjLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsb0JBQW9CO1NBQ3ZFLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLEdBQUc7WUFDZixjQUFjO1lBQ2QsWUFBWTtZQUNaLFlBQVk7U0FDYixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUTtRQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLFNBQVMsS0FBSyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVNLGFBQWE7UUFDbEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxjQUFjO1FBQ25CLE9BQU8sd0NBQXdDLENBQUM7SUFDbEQsQ0FBQztJQUVNLEtBQUssQ0FBQyxZQUFZO1FBQ3ZCLE9BQU87SUFDVCxDQUFDOztBQS9GSCx3REFnR0M7QUE3RndCLGlDQUFVLEdBQUcsd0JBQXdCLENBQUMifQ==