#!/usr/bin/env node
"use strict";
/* eslint-disable prettier/prettier */
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchApp = void 0;
const cactus_cmd_api_server_1 = require("@hyperledger/cactus-cmd-api-server");
const cactus_common_1 = require("@hyperledger/cactus-common");
const healthcare_app_1 = require("./healthcare-app");
require("dotenv/config");
async function launchApp(env, args) {
    const configService = new cactus_cmd_api_server_1.ConfigService();
    const exampleConfig = await configService.newExampleConfig();
    exampleConfig.configFile = "";
    exampleConfig.authorizationConfigJson = JSON.stringify(exampleConfig.authorizationConfigJson);
    exampleConfig.authorizationProtocol = cactus_cmd_api_server_1.AuthorizationProtocol.NONE;
    const convictConfig = await configService.newExampleConfigConvict(exampleConfig);
    env = await configService.newExampleConfigEnv(convictConfig.getProperties());
    const config = await configService.getOrCreate({ args, env });
    const serverOptions = config.getProperties();
    cactus_common_1.LoggerProvider.setLogLevel(serverOptions.logLevel);
    if (process.env.API_HOST == undefined ||
        process.env.API_SERVER_1_PORT == undefined ||
        process.env.API_SERVER_2_PORT == undefined) {
        throw new Error("Env variables not set");
    }
    const appOptions = {
        apiHost: process.env.API_HOST,
        apiServer1Port: parseInt(process.env.API_SERVER_1_PORT),
        apiServer2Port: parseInt(process.env.API_SERVER_2_PORT),
        logLevel: "DEBUG",
    };
    const App = new healthcare_app_1.HealthCareApp(appOptions);
    try {
        await App.start();
        console.info("HealthCareApp running...");
    }
    catch (ex) {
        console.error(`HealthCareApp crashed. Exiting...`, ex);
        await App.stop();
        process.exit(-1);
    }
}
exports.launchApp = launchApp;
if (require.main === module) {
    launchApp();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoY2FyZS1hcHAtY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9oZWFsdGhjYXJlLWFwcC1jbGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxzQ0FBc0M7OztBQUV0Qyw4RUFJNEM7QUFDNUMsOERBQTREO0FBQzVELHFEQUFpRTtBQUNqRSx5QkFBdUI7QUFFaEIsS0FBSyxVQUFVLFNBQVMsQ0FDM0IsR0FBdUIsRUFDdkIsSUFBZTtJQUVmLE1BQU0sYUFBYSxHQUFHLElBQUkscUNBQWEsRUFBRSxDQUFDO0lBQzFDLE1BQU0sYUFBYSxHQUFHLE1BQU0sYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDN0QsYUFBYSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDOUIsYUFBYSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxTQUFTLENBQ2xELGFBQWEsQ0FBQyx1QkFBdUIsQ0FDTCxDQUFDO0lBQ3JDLGFBQWEsQ0FBQyxxQkFBcUIsR0FBRyw2Q0FBcUIsQ0FBQyxJQUFJLENBQUM7SUFFakUsTUFBTSxhQUFhLEdBQ2YsTUFBTSxhQUFhLENBQUMsdUJBQXVCLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFL0QsR0FBRyxHQUFHLE1BQU0sYUFBYSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBRTdFLE1BQU0sTUFBTSxHQUFHLE1BQU0sYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzlELE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUU3Qyw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkQsSUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxTQUFTO1FBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLElBQUksU0FBUztRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLFNBQVMsRUFDNUM7UUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDNUM7SUFFRCxNQUFNLFVBQVUsR0FBbUI7UUFDL0IsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTtRQUM3QixjQUFjLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7UUFDdkQsY0FBYyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDO1FBQ3ZELFFBQVEsRUFBRSxPQUFPO0tBQ3BCLENBQUM7SUFFRixNQUFNLEdBQUcsR0FBRyxJQUFJLDhCQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsSUFBSTtRQUNBLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUM1QztJQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RCxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEI7QUFDTCxDQUFDO0FBOUNELDhCQThDQztBQUVELElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDekIsU0FBUyxFQUFFLENBQUM7Q0FDZiJ9