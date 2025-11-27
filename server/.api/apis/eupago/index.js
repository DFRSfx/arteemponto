import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';
class SDK {
    constructor() {
        this.spec = Oas.init(definition);
        this.core = new APICore(this.spec, 'eupago/unknown (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config) {
        this.core.setConfig(config);
    }
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
    auth(...values) {
        this.core.setAuth(...values);
        return this;
    }
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
    server(url, variables = {}) {
        this.core.setServer(url, variables);
    }
    /**
     * Creates Multibanco payment references:
     * - with or without payment deadline
     * - define an amount or an interval with max/min amounts to receive the payment
     * - may choose if the references allow only 1 or more that 1 payment
     *
     * @summary Multibanco
     */
    multibanco(body) {
        return this.core.fetch('/multibanco/create', 'post', body);
    }
    /**
     * Creates MB WAY payment requests.
     *
     * @summary MB WAY
     */
    mbWay(body) {
        return this.core.fetch('/mbway/create', 'post', body);
    }
    /**
     * Creates Payshop payment references.
     *
     * These references are paid in cash on a large Portuguese network.
     *
     * @summary Payshop
     */
    payshop(body) {
        return this.core.fetch('/payshop/create', 'post', body);
    }
    /**
     * Creates Paysafecard payment references.
     *
     * @summary Paysafecard
     */
    paysafecard(body) {
        return this.core.fetch('/paysafecard/create', 'post', body);
    }
    /**
     * Creates a url to a secure form where the customer may finish the Credit Card payment.
     * Uses 3D Secure Technology.
     *
     * @summary Credit Card 3DS
     */
    creditCard3ds(body) {
        return this.core.fetch('/cc/form', 'post', body);
    }
    /**
     * Check the status of a reference on Eupago.
     *
     * @summary Reference Information
     */
    referenceInformation(body) {
        return this.core.fetch('/multibanco/info', 'post', body);
    }
    /**
     * Creates MB WAY Meal Passes payment requests.
     *
     * @summary MB WAY Meal Passes
     */
    mbWayMealPasses(body) {
        return this.core.fetch('/mbway_refeicao/create', 'post', body);
    }
    /**
     * Creates Multibanco payment references with a deadline, using check-digit. These
     * references will only accept a single payment in a specific amount until they exceed
     * their deadline.
     *
     * @summary Multibanco DPG
     */
    multibancoDpg(body) {
        return this.core.fetch('/multibanco/apg', 'post', body);
    }
}
const createSDK = (() => { return new SDK(); })();
export default createSDK;
