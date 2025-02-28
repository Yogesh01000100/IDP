/* tslint:disable */
/* eslint-disable */
/**
 * Hyperledger Cactus Example - Health Care EHR App
 * Demonstrates EHR management across multiple distinct Hyperledger Fabric ledgers.
 *
 * The version of the OpenAPI document: v1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError } from './base';

/**
 * Response containing patient profile information, including contact and network details.
 * @export
 * @interface GetMyProfilePatientResponseHSPA
 */
export interface GetMyProfilePatientResponseHSPA {
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPA
     */
    'u_id'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPA
     */
    'role'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPA
     */
    'first_name'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPA
     */
    'last_name'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPA
     */
    'contact_email'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPA
     */
    'contact_phone'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPA
     */
    'network_id'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof GetMyProfilePatientResponseHSPA
     */
    'capabilities'?: Array<string>;
}
/**
 * Response containing patient profile information, including contact and network details.
 * @export
 * @interface GetMyProfilePatientResponseHSPB
 */
export interface GetMyProfilePatientResponseHSPB {
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPB
     */
    'u_id'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPB
     */
    'role'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPB
     */
    'first_name'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPB
     */
    'last_name'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPB
     */
    'contact_email'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPB
     */
    'contact_phone'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetMyProfilePatientResponseHSPB
     */
    'network_id'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof GetMyProfilePatientResponseHSPB
     */
    'capabilities'?: Array<string>;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get My Profile
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMyProfilePatientHSPA: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/cactus-healthcare-backend/get-my-profile-patient-hspa`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get My Profile
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMyProfilePatientHSPB: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/cactus-healthcare-backend/get-my-profile-patient-hspb`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Get My Profile
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMyProfilePatientHSPA(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetMyProfilePatientResponseHSPA>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getMyProfilePatientHSPA(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Get My Profile
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMyProfilePatientHSPB(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetMyProfilePatientResponseHSPB>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getMyProfilePatientHSPB(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DefaultApiFp(configuration)
    return {
        /**
         * 
         * @summary Get My Profile
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMyProfilePatientHSPA(options?: any): AxiosPromise<GetMyProfilePatientResponseHSPA> {
            return localVarFp.getMyProfilePatientHSPA(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get My Profile
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMyProfilePatientHSPB(options?: any): AxiosPromise<GetMyProfilePatientResponseHSPB> {
            return localVarFp.getMyProfilePatientHSPB(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @summary Get My Profile
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getMyProfilePatientHSPA(options?: AxiosRequestConfig) {
        return DefaultApiFp(this.configuration).getMyProfilePatientHSPA(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get My Profile
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getMyProfilePatientHSPB(options?: AxiosRequestConfig) {
        return DefaultApiFp(this.configuration).getMyProfilePatientHSPB(options).then((request) => request(this.axios, this.basePath));
    }
}


