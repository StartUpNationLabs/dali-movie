/* tslint:disable */
/* eslint-disable */
/**
 * Dali Video API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface SessionIdGeneratePost200Response
 */
export interface SessionIdGeneratePost200Response {
    /**
     * The video URL
     * @type {string}
     * @memberof SessionIdGeneratePost200Response
     */
    'video'?: string;
    /**
     * 
     * @type {Array<SessionIdTimelinePost200ResponseErrorsInner>}
     * @memberof SessionIdGeneratePost200Response
     */
    'errors'?: Array<SessionIdTimelinePost200ResponseErrorsInner>;
}
/**
 * 
 * @export
 * @interface SessionIdTimelinePost200Response
 */
export interface SessionIdTimelinePost200Response {
    /**
     * 
     * @type {Array<SessionIdTimelinePost200ResponseTimelineInner>}
     * @memberof SessionIdTimelinePost200Response
     */
    'timeline'?: Array<SessionIdTimelinePost200ResponseTimelineInner>;
    /**
     * 
     * @type {Array<SessionIdTimelinePost200ResponseErrorsInner>}
     * @memberof SessionIdTimelinePost200Response
     */
    'errors'?: Array<SessionIdTimelinePost200ResponseErrorsInner>;
}
/**
 * 
 * @export
 * @interface SessionIdTimelinePost200ResponseErrorsInner
 */
export interface SessionIdTimelinePost200ResponseErrorsInner {
    /**
     * 
     * @type {string}
     * @memberof SessionIdTimelinePost200ResponseErrorsInner
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof SessionIdTimelinePost200ResponseErrorsInner
     */
    'message': string;
}
/**
 * 
 * @export
 * @interface SessionIdTimelinePost200ResponseTimelineInner
 */
export interface SessionIdTimelinePost200ResponseTimelineInner {
    /**
     * 
     * @type {string}
     * @memberof SessionIdTimelinePost200ResponseTimelineInner
     */
    'name': string;
    /**
     * 
     * @type {Array<SessionIdTimelinePost200ResponseTimelineInnerDataInner>}
     * @memberof SessionIdTimelinePost200ResponseTimelineInner
     */
    'data': Array<SessionIdTimelinePost200ResponseTimelineInnerDataInner>;
}
/**
 * 
 * @export
 * @interface SessionIdTimelinePost200ResponseTimelineInnerDataInner
 */
export interface SessionIdTimelinePost200ResponseTimelineInnerDataInner {
    /**
     * 
     * @type {string}
     * @memberof SessionIdTimelinePost200ResponseTimelineInnerDataInner
     */
    'x': string;
    /**
     * 
     * @type {Array<number>}
     * @memberof SessionIdTimelinePost200ResponseTimelineInnerDataInner
     */
    'y': Array<number>;
    /**
     * 
     * @type {Array<SessionIdTimelinePost200ResponseTimelineInnerDataInnerGoalsInner>}
     * @memberof SessionIdTimelinePost200ResponseTimelineInnerDataInner
     */
    'goals'?: Array<SessionIdTimelinePost200ResponseTimelineInnerDataInnerGoalsInner>;
}
/**
 * 
 * @export
 * @interface SessionIdTimelinePost200ResponseTimelineInnerDataInnerGoalsInner
 */
export interface SessionIdTimelinePost200ResponseTimelineInnerDataInnerGoalsInner {
    /**
     * 
     * @type {string}
     * @memberof SessionIdTimelinePost200ResponseTimelineInnerDataInnerGoalsInner
     */
    'name': string;
    /**
     * 
     * @type {number}
     * @memberof SessionIdTimelinePost200ResponseTimelineInnerDataInnerGoalsInner
     */
    'value': number;
    /**
     * 
     * @type {string}
     * @memberof SessionIdTimelinePost200ResponseTimelineInnerDataInnerGoalsInner
     */
    'strokeColor': string;
}
/**
 * 
 * @export
 * @interface SessionIdTimelinePostRequest
 */
export interface SessionIdTimelinePostRequest {
    /**
     * The languim language code
     * @type {string}
     * @memberof SessionIdTimelinePostRequest
     */
    'langium'?: string;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Generate a Video
         * @summary Generate a Video
         * @param {string} sessionId The session ID
         * @param {SessionIdTimelinePostRequest} sessionIdTimelinePostRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sessionIdGeneratePost: async (sessionId: string, sessionIdTimelinePostRequest: SessionIdTimelinePostRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'sessionId' is not null or undefined
            assertParamExists('sessionIdGeneratePost', 'sessionId', sessionId)
            // verify required parameter 'sessionIdTimelinePostRequest' is not null or undefined
            assertParamExists('sessionIdGeneratePost', 'sessionIdTimelinePostRequest', sessionIdTimelinePostRequest)
            const localVarPath = `/{session_id}/generate`
                .replace(`{${"session_id"}}`, encodeURIComponent(String(sessionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(sessionIdTimelinePostRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get timeline for a session
         * @summary Get timeline for a session
         * @param {string} sessionId The session ID
         * @param {SessionIdTimelinePostRequest} sessionIdTimelinePostRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sessionIdTimelinePost: async (sessionId: string, sessionIdTimelinePostRequest: SessionIdTimelinePostRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'sessionId' is not null or undefined
            assertParamExists('sessionIdTimelinePost', 'sessionId', sessionId)
            // verify required parameter 'sessionIdTimelinePostRequest' is not null or undefined
            assertParamExists('sessionIdTimelinePost', 'sessionIdTimelinePostRequest', sessionIdTimelinePostRequest)
            const localVarPath = `/{session_id}/timeline`
                .replace(`{${"session_id"}}`, encodeURIComponent(String(sessionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(sessionIdTimelinePostRequest, localVarRequestOptions, configuration)

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
         * Generate a Video
         * @summary Generate a Video
         * @param {string} sessionId The session ID
         * @param {SessionIdTimelinePostRequest} sessionIdTimelinePostRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async sessionIdGeneratePost(sessionId: string, sessionIdTimelinePostRequest: SessionIdTimelinePostRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SessionIdGeneratePost200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.sessionIdGeneratePost(sessionId, sessionIdTimelinePostRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.sessionIdGeneratePost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Get timeline for a session
         * @summary Get timeline for a session
         * @param {string} sessionId The session ID
         * @param {SessionIdTimelinePostRequest} sessionIdTimelinePostRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async sessionIdTimelinePost(sessionId: string, sessionIdTimelinePostRequest: SessionIdTimelinePostRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SessionIdTimelinePost200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.sessionIdTimelinePost(sessionId, sessionIdTimelinePostRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.sessionIdTimelinePost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
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
         * Generate a Video
         * @summary Generate a Video
         * @param {string} sessionId The session ID
         * @param {SessionIdTimelinePostRequest} sessionIdTimelinePostRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sessionIdGeneratePost(sessionId: string, sessionIdTimelinePostRequest: SessionIdTimelinePostRequest, options?: RawAxiosRequestConfig): AxiosPromise<SessionIdGeneratePost200Response> {
            return localVarFp.sessionIdGeneratePost(sessionId, sessionIdTimelinePostRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * Get timeline for a session
         * @summary Get timeline for a session
         * @param {string} sessionId The session ID
         * @param {SessionIdTimelinePostRequest} sessionIdTimelinePostRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sessionIdTimelinePost(sessionId: string, sessionIdTimelinePostRequest: SessionIdTimelinePostRequest, options?: RawAxiosRequestConfig): AxiosPromise<SessionIdTimelinePost200Response> {
            return localVarFp.sessionIdTimelinePost(sessionId, sessionIdTimelinePostRequest, options).then((request) => request(axios, basePath));
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
     * Generate a Video
     * @summary Generate a Video
     * @param {string} sessionId The session ID
     * @param {SessionIdTimelinePostRequest} sessionIdTimelinePostRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public sessionIdGeneratePost(sessionId: string, sessionIdTimelinePostRequest: SessionIdTimelinePostRequest, options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).sessionIdGeneratePost(sessionId, sessionIdTimelinePostRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get timeline for a session
     * @summary Get timeline for a session
     * @param {string} sessionId The session ID
     * @param {SessionIdTimelinePostRequest} sessionIdTimelinePostRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public sessionIdTimelinePost(sessionId: string, sessionIdTimelinePostRequest: SessionIdTimelinePostRequest, options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).sessionIdTimelinePost(sessionId, sessionIdTimelinePostRequest, options).then((request) => request(this.axios, this.basePath));
    }
}



