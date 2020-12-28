export const PAYMENTS_COLLECTION_NAME = 'payments';

export interface Payment {
    key: string;
    order_id: string;
    currency: string;
    product_id: string;
    product_name: string;
    quantity: string;
    receipt_url: string;
    sale_gross: string;
    points: string;
    payment_method: string;
    date: string;
}
