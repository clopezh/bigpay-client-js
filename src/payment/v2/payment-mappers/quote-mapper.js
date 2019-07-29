import { omitNil, toString } from '../../../common/utils';

export default class QuoteMapper {
    /**
     * @returns {QuoteMapper}
     */
    static create() {
        return new QuoteMapper();
    }

    /**
     * @param {PaymentRequestData} data
     * @returns {Object}
     */
    mapToQuote(data) {
        return omitNil({
            billing_address: this.mapToAddress(data, 'billingAddress'),
            shipping_address: this.mapToAddress(data, 'shippingAddress'),
            customer: this.mapToCustomer(data),
        });
    }

    /**
     * @private
     * @param {PaymentRequestData} data
     * @param {string} addressKey
     * @returns {Object}
     */
    mapToAddress(data, addressKey) {
        const { customer = {} } = data;
        const address = data[addressKey] || {};

        return omitNil({
            address_line_1: address.addressLine1,
            address_line_2: address.addressLine2,
            city: address.city,
            company: address.company,
            country_code: address.countryCode,
            email: customer.email,
            first_name: address.firstName,
            last_name: address.lastName,
            phone: address.phone,
            postal_code: address.postCode,
            state: address.province,
        });
    }

    /**
     * @param {PaymentRequestData} data
     * @returns {Object}
     */
    mapToCustomer(data) {
        const { customer = {} } = data;

        return omitNil({
            id: customer.customerId ? toString(customer.customerId) : null,
            name: customer.name ? toString(customer.name) : null,
            email: customer.email ? toString(customer.email) : null,
        });
    }
}
