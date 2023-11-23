#!/usr/bin/env node
/* eslint-disable prettier/prettier */

import {
    AuthorizationProtocol,
    ConfigService,
    IAuthorizationConfig,
} from "@hyperledger/cactus-cmd-api-server";
import { LoggerProvider } from "@hyperledger/cactus-common";
import { IHealthCareApp, HealthCareApp } from "./healthcare-app";
import "dotenv/config";

export async function launchApp(
    env?: NodeJS.ProcessEnv,
    args?: string[],
): Promise<void> {
    const configService = new ConfigService();
    const exampleConfig = await configService.newExampleConfig();
    exampleConfig.configFile = "";
    exampleConfig.authorizationConfigJson = JSON.stringify(
        exampleConfig.authorizationConfigJson,
    ) as unknown as IAuthorizationConfig;
    exampleConfig.authorizationProtocol = AuthorizationProtocol.NONE;

    const convictConfig =
        await configService.newExampleConfigConvict(exampleConfig);

    env = await configService.newExampleConfigEnv(convictConfig.getProperties());

    const config = await configService.getOrCreate({ args, env });
    const serverOptions = config.getProperties();

    LoggerProvider.setLogLevel(serverOptions.logLevel);

    if (
        process.env.API_HOST == undefined ||
        process.env.API_SERVER_1_PORT == undefined ||
        process.env.API_SERVER_2_PORT == undefined
    ) {
        throw new Error("Env variables not set");
    }

    const appOptions: IHealthCareApp = {
        apiHost: process.env.API_HOST,
        apiServer1Port: parseInt(process.env.API_SERVER_1_PORT),
        apiServer2Port: parseInt(process.env.API_SERVER_2_PORT),
        logLevel: "DEBUG",
    };

    const App = new HealthCareApp(appOptions);
    try {
        await App.start();
        console.info("HealthCareApp running...");
    } catch (ex) {
        console.error(`HealthCareApp crashed. Existing...`, ex);
        await App.stop();
        process.exit(-1);
    }
}

if (require.main === module) {
    launchApp();
}
