import objectAssign from 'object-assign';
import { omitNil, toString } from '../../common/utils';
import PaymentMethodIdMapper from '../payment-method-mappers/payment-method-id-mapper';
import MetaMapper from '../offsite-payment-mappers/meta-mapper';
import StoreMapper from '../offsite-payment-mappers/store-mapper';

export default class PayloadMapper {
    /**
     * @returns {PayloadMapper}
     */
    static create() {
        const metaMapper = MetaMapper.create();
        const paymentMethodIdMapper = PaymentMethodIdMapper.create();
        const storeMapper = StoreMapper.create();

        return new PayloadMapper(metaMapper, paymentMethodIdMapper, storeMapper);
    }

    /**
     * @param {MetaMapper} metaMapper
     * @param {PaymentMethodIdMapper} paymentMethodIdMapper
     * @param {StoreMapper} storeMapper
     * @returns {Object}
     */
    constructor(metaMapper, paymentMethodIdMapper, storeMapper) {
        /**
         * @private
         * @type {MetaMapper}
         */
        this.metaMapper = metaMapper;

        /**
         * @private
         * @type {PaymentMethodIdMapper}
         */
        this.paymentMethodIdMapper = paymentMethodIdMapper;

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
    mapToPayload(data) {
        const { authToken, order = {}, payment, paymentMethod = {} } = data;

        const payload = objectAssign(
            {
                amount: order.grandTotal ? order.grandTotal.integerAmount : null,
                bc_auth_token: authToken,
                currency: order.currency,
                gateway: this.paymentMethodIdMapper.mapToId(paymentMethod),
                notify_url: order.callbackUrl,
                order_id: order.orderId ? toString(order.orderId) : null,
                page_title: document.title ? document.title : null,
                payment_data: payment,
                payment_method_id: paymentMethod.id,
                reference_id: order.orderId ? toString(order.orderId) : null,
                return_url: paymentMethod.returnUrl || (order.payment ? order.payment.returnUrl : null),
            },
            this.metaMapper.mapToMeta(data),
            this.storeMapper.mapToStore(data)
        );

        return omitNil(payload);
    }
}
