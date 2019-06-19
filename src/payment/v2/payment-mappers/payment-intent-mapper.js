import { omitNil } from '../../../common/utils';
import GatewayMapper from './gateway-mapper';
import QuoteMapper from './quote-mapper';
import StoreMapper from './store-mapper';

export default class PaymentIntentMapper {
    /**
     * @returns {PaymentIntentMapper}
     */
    static create() {
        const gatewayMapper = GatewayMapper.create();
        const quoteMapper = QuoteMapper.create();
        const storeMapper = StoreMapper.create();

        return new PaymentIntentMapper(gatewayMapper, quoteMapper, storeMapper);
    }

    /**
     * @param {GatewayMapper} gatewayMapper
     * @param {QuoteMapper} quoteMapper
     * @param {StoreMapper} storeMapper
     */
    constructor(gatewayMapper, quoteMapper, storeMapper) {
        /**
         * @private
         * @type {GatewayMapper}
         */
        this.gatewayMapper = gatewayMapper;

        /**
         * @private
         * @type {QuoteMapper}
         */
        this.quoteMapper = quoteMapper;

        /**
         * @private
         * @type {StoreMapper}
         */
        this.storeMapper = storeMapper;
    }

    /**
     * @param {PaymentRequestData} data
     * @returns {Object}
     */
    mapToPaymentIntent(data) {
        return omitNil({
            stripe_data: this.mapStripeData(data),
            gateway: this.gatewayMapper.mapToGateway(data),
        });
    }

    mapStripeData(data) {
        const {
            shouldSavePaymentInstrument = false,
            customer = {},
            cart = {},
            store = {},
        } = data;

        return omitNil({
            should_save_payment_instrument: shouldSavePaymentInstrument,
            customer_id: customer.customerId,
            customer_name: customer.name,
            grand_total: cart.grandTotal.integerAmount,
            currency_code: cart.currency,
            store_id: store.storeId,
            store_name: store.storeName,
        });
    }
}
