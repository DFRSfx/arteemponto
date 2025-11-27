import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values: string[] | number[]): this;
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url: string, variables?: {}): void;
    /**
     * Creates Multibanco payment references:
     * - with or without payment deadline
     * - define an amount or an interval with max/min amounts to receive the payment
     * - may choose if the references allow only 1 or more that 1 payment
     *
     * @summary Multibanco
     */
    multibanco(body: types.MultibancoBodyParam): Promise<FetchResponse<200, types.MultibancoResponse200>>;
    /**
     * Creates MB WAY payment requests.
     *
     * @summary MB WAY
     */
    mbWay(body: types.MbWayBodyParam): Promise<FetchResponse<200, types.MbWayResponse200>>;
    /**
     * Creates Payshop payment references.
     *
     * These references are paid in cash on a large Portuguese network.
     *
     * @summary Payshop
     */
    payshop(body: types.PayshopBodyParam): Promise<FetchResponse<200, types.PayshopResponse200>>;
    /**
     * Creates Paysafecard payment references.
     *
     * @summary Paysafecard
     */
    paysafecard(body: types.PaysafecardBodyParam): Promise<FetchResponse<200, types.PaysafecardResponse200>>;
    /**
     * Creates a url to a secure form where the customer may finish the Credit Card payment.
     * Uses 3D Secure Technology.
     *
     * @summary Credit Card 3DS
     */
    creditCard3ds(body: types.CreditCard3DsBodyParam): Promise<FetchResponse<200, types.CreditCard3DsResponse200>>;
    /**
     * Check the status of a reference on Eupago.
     *
     * @summary Reference Information
     */
    referenceInformation(body: types.ReferenceInformationBodyParam): Promise<FetchResponse<200, types.ReferenceInformationResponse200>>;
    /**
     * Creates MB WAY Meal Passes payment requests.
     *
     * @summary MB WAY Meal Passes
     */
    mbWayMealPasses(body: types.MbWayMealPassesBodyParam): Promise<FetchResponse<200, types.MbWayMealPassesResponse200>>;
    /**
     * Creates Multibanco payment references with a deadline, using check-digit. These
     * references will only accept a single payment in a specific amount until they exceed
     * their deadline.
     *
     * @summary Multibanco DPG
     */
    multibancoDpg(body: types.MultibancoDpgBodyParam): Promise<FetchResponse<200, types.MultibancoDpgResponse200>>;
}
declare const createSDK: SDK;
export default createSDK;
