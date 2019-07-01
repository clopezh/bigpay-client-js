import GatewayMapper from '../../../../src/payment/v2/payment-mappers/gateway-mapper';
import QuoteMapper from '../../../../src/payment/v2/payment-mappers/quote-mapper';
import StoreMapper from '../../../../src/payment/v2/payment-mappers/store-mapper';
import paymentRequestDataMock from '../../../mocks/payment-request-data';
import PaymentIntentMapper from '../../../../src/payment/v2/payment-mappers/payment-intent-mapper';

describe('PaymentIntentMapper', () => {
    let data;
    let quoteMapper;
    let storeMapper;
    let gatewayMapper;
    let paymentIntentMapper;
    let mappedData;
    let paymentMethodIdMapper;

    beforeEach(() => {
        data = paymentRequestDataMock;
        mappedData = {
            name: 'id',
        };

        paymentMethodIdMapper = {
            mapToId: jasmine.createSpy('mapToId').and.returnValue(mappedData.name),
        };

        quoteMapper = new QuoteMapper();
        storeMapper = new StoreMapper();
        gatewayMapper = new GatewayMapper(paymentMethodIdMapper);

        paymentIntentMapper = new PaymentIntentMapper(gatewayMapper, quoteMapper, storeMapper);
    });

    it('create a instance of paymentIntentMapper', () => {
        const instance = PaymentIntentMapper.create();

        expect(instance instanceof PaymentIntentMapper).toBeTruthy();
    });

    it('map the data to the payment intent', () => {
        const output = paymentIntentMapper.mapToPaymentIntent(data);

        expect(output).toEqual({
            stripe_data: paymentIntentMapper.mapStripeData(data),
            gateway: gatewayMapper.mapToGateway(data),
        });
    });
});
