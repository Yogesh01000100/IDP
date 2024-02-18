/* eslint-disable prettier/prettier */
import OAS from "../../json/openapi.json";// to be done


import { Express } from "express";

import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import {
  ICactusPlugin,
  IPluginWebService,
  IWebServiceEndpoint,
} from "@hyperledger/cactus-core-api";

import { DefaultApi as FabricApi } from "@hyperledger/cactus-plugin-ledger-connector-fabric";

//import { IHealthCareContractDeploymentInfo } from "../i-healthcare-contract-deployment-info";

import { CreateDoctor } from "./web-services/create-doctor";
import { CreatePatient } from "./web-services/create-patient";
import { CreateAppointment } from "./web-services/create-appointment";
import { AcceptAppointment } from "./web-services/accept-appointment";
import { GetAppointmentData } from "./web-services/get-appointment-data";
import { GetMyProfilePatient } from "./web-services/get-my-profile-patient";
import { GetMyProfileDoctor } from "./web-services/get-my-profile-doctor";
import { GetMyProfileAssistantDoctor } from "./web-services/get-my-profile-asst-doctor";
import { SendEHRToAppointment } from "./web-services/send-ehr-to-appointment";
import { GetEHRForDoctor } from "./web-services/get-ehr-doctor";
import { GetEHRForPatient } from "./web-services/get-ehr-patient";

import CryptoMaterial from "../../../crypto-material/crypto-material.json";

export interface OrgEnv {
  CORE_PEER_LOCALMSPID: string;
  CORE_PEER_ADDRESS: string;
  CORE_PEER_MSPCONFIGPATH: string;
  CORE_PEER_TLS_ROOTCERT_FILE: string;
  ORDERER_TLS_ROOTCERT_FILE: string;
}

export interface IHealthCareCactusPluginOptions {
  logLevel?: LogLevelDesc;
  instanceId: string;
  fabricApiClient1: FabricApi;
  fabricApiClient2: FabricApi;
  fabricEnvironment?: NodeJS.ProcessEnv;
}

export class HealthCareCactusPlugin
  implements ICactusPlugin, IPluginWebService
{
  public static readonly CLASS_NAME = "HealthCareCactusPlugin";

  private readonly log: Logger;
  private readonly instanceId: string;

  private endpoints: IWebServiceEndpoint[] | undefined;

  public get className(): string {
    return HealthCareCactusPlugin.CLASS_NAME;
  }

  constructor(public readonly options: IHealthCareCactusPluginOptions) {
    const fnTag = `${this.className}#constructor`;

    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.instanceId, `${fnTag} arg options.instanceId`);
    Checks.nonBlankString(options.instanceId, `${fnTag} options.instanceId`);
    //Checks.truthy(options.contracts, `${fnTag} arg options.contracts`); // watch for contract variable
    Checks.truthy(
      options.fabricApiClient1,
      `${fnTag} arg options.fabricApiClient1`,
    );
    Checks.truthy(
      options.fabricApiClient2,
      `${fnTag} arg options.fabricApiClient2`,
    );

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
    this.instanceId = options.instanceId;
  }

  public getOpenApiSpec(): unknown {
    return OAS;
  }

  async registerWebServices(app: Express): Promise<IWebServiceEndpoint[]> {
    const webServices = await this.getOrCreateWebServices();
    await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
    return webServices;
  }

  public async getOrCreateWebServices(): Promise<IWebServiceEndpoint[]> {
    if (Array.isArray(this.endpoints)) {
      return this.endpoints;
    }  

    // Endpoints for network 1
    const createDoctorNet1 = new CreateDoctor({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });
    const createPatientNet1  = new CreatePatient({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });

    const createAppointmentNet1  = new CreateAppointment({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });

    const acceptAppointmentNet1  = new AcceptAppointment({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });

    const getAppointmentDataNet1  = new GetAppointmentData({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });

    const getMyProfilePatientNet1  = new GetMyProfilePatient({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });

    const getMyProfileDoctorNet1  = new GetMyProfileDoctor({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });

    const getMyProfileAssistantDoctorNet1  = new GetMyProfileAssistantDoctor({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });

    const sendEHRToAppointmentNet1  = new SendEHRToAppointment({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });


    const getEHRForDoctorNet1  = new GetEHRForDoctor({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });

    const getEHRForPatientNet1  = new GetEHRForPatient({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient1,
      keychainId: CryptoMaterial.keychains.keychain1.id,
    });

    // Endpoints for network 2
    const createDoctorNet2 = new CreateDoctor({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });
    const createPatientNet2  = new CreatePatient({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });

    const createAppointmentNet2  = new CreateAppointment({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });

    const acceptAppointmentNet2  = new AcceptAppointment({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });

    const getAppointmentDataNet2  = new GetAppointmentData({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });

    const getMyProfilePatientNet2  = new GetMyProfilePatient({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });

    const getMyProfileDoctorNet2  = new GetMyProfileDoctor({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });

    const getMyProfileAssistantDoctorNet2  = new GetMyProfileAssistantDoctor({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });

    const sendEHRToAppointmentNet2  = new SendEHRToAppointment({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });


    const getEHRForDoctorNet2  = new GetEHRForDoctor({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });

    const getEHRForPatientNet2  = new GetEHRForPatient({
      logLevel: this.options.logLevel,
      fabricApi: this.options.fabricApiClient2,
      keychainId: CryptoMaterial.keychains.keychain2.id,
    });

    this.endpoints = [
      createDoctorNet1,
      createPatientNet1,
      createAppointmentNet1,
      acceptAppointmentNet1,
      getAppointmentDataNet1,
      getMyProfilePatientNet1,
      getMyProfileDoctorNet1,
      getMyProfileAssistantDoctorNet1,
      sendEHRToAppointmentNet1,
      getEHRForDoctorNet1,
      getEHRForPatientNet1,
      createDoctorNet2,
      createPatientNet2,
      createAppointmentNet2,
      acceptAppointmentNet2,
      getAppointmentDataNet2,
      getMyProfilePatientNet2,
      getMyProfileDoctorNet2,
      getMyProfileAssistantDoctorNet2,
      sendEHRToAppointmentNet2,
      getEHRForDoctorNet2,
      getEHRForPatientNet2
    ];

    return this.endpoints;
  }

  public async shutdown(): Promise<void> {
    this.log.info(`Shutting down ${this.className}...`);
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public getPackageName(): string {
    return "@hyperledger/cactus-healthcare-backend";
  }

  public async onPluginInit(): Promise<unknown> {
    return;
  }
}
