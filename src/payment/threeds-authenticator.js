import { createFormPoster } from '@bigcommerce/form-poster';
import { API } from './payment-types';
import PayloadMapper from './threeds-authenticate-mappers/payload-mapper';
import UrlHelper from './url-helper';

export default class ThreeDSAuthenticator {
    /**
     * @param {Object} config
     * @returns {ThreeDSAuthenticator}
     */
    static create(config) {
        const urlHelper = UrlHelper.create(config);
        const formPoster = createFormPoster();
        const payloadMapper = PayloadMapper.create();

        return new ThreeDSAuthenticator(urlHelper, formPoster, payloadMapper);
    }

    /**
     * @param {UrlHelper} urlHelper
     * @param {FormPoster} formPoster
     * @param {PayloadMapper} payloadMapper
     * @returns {void}
     */
    constructor(urlHelper, formPoster, payloadMapper) {
        /**
         * @private
         * @type {UrlHelper}
         */
        this.urlHelper = urlHelper;

        /**
         * @private
         * @type {FormPoster}
         */
        this.formPoster = formPoster;

        /**
         * @private
         * @type {PayloadMapper}
         */
        this.payloadMapper = payloadMapper;
    }

    /**
     * @param {PaymentRequestData} data
     * @param {Function} [callback]
     * @returns {void}
     * @throws {Error}
     */
    authenticateThreeDS(data, callback) {
        const { paymentMethod = {} } = data;

        if (paymentMethod.type !== API) {
            throw new Error(`${paymentMethod.type} is not supported.`);
        }

        const payload = this.payloadMapper.mapToPayload(data);
        const url = this.urlHelper.getThreeDSAuthenticateUrl();

        this.formPoster.postForm(url, payload, callback);
    }
}
