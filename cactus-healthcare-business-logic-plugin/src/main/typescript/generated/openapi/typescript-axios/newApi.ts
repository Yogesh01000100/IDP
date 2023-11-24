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
 * 
 * @export
 * @interface SourceRepository
 */
export interface SourceRepository {
    /**
     * 
     * @type {string}
     * @memberof SourceRepository
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof SourceRepository
     */
    'location': string;
    /**
     * 
     * @type {string}
     * @memberof SourceRepository
     */
    'source': string;
}
/**
 * 
 * @export
 * @interface DestinationRepository
 */
export interface DestinationRepository {
    /**
     * 
     * @type {string}
     * @memberof DestinationRepository
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof DestinationRepository
     */
    'location': string;
    /**
     * 
     * @type {string}
     * @memberof DestinationRepository
     */
    'sourceRepositoryId': string;
}