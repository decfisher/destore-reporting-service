import { Document, model, Schema } from 'mongoose';

export interface CountTransationsBetweenDatesRequest {
    start: Date;
    end: Date;
}

export interface Transaction {
    id: string;
    customer_id: string;
    total: number;
    total_with_discount: number;
    delivery_charged: number;
    used_loyalty: boolean;
    loyalty_discount_type: string;
    time: Date;
    products_purchased: Product[];
}

export interface ITransaction {
    customer_id: string;
    total: number;
    total_with_discount: number;
    delivery_charged: number;
    used_loyalty: boolean;
    loyalty_discount_type: string;
    time: Date;
    products_purchased: Product[];
}

export interface ITransactionDocument extends ITransaction, Document {}

export interface IProduct {
    name: string;
    price: number;
    amount_purchased: number;
    discount: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    amount_purchased: number;
    discount: string;
}

export interface IProductDocument extends IProduct, Document {}

const productSchema = new Schema<IProductDocument>(
    {
        id: {
            type: String,
        },
        name: { 
            type: String,
        },
        price: {
            type: Number,
        },
        amount_purchased: {
            type: Number,
        },
        discount: {
            type: String,
        },
    },
);

const transactionSchema = new Schema<ITransactionDocument>(
    {
        customer_id: { 
            type: String,
        },
        total: {
            type: Number,
            default: 0.00,
        },
        total_with_discount: {
            type: Number,
            default: 0.00,
        },
        delivery_charged: {
            type: Number,
            default: 0.00,
        },
        used_loyalty: {
            type: Boolean,
            default: false,
        },
        loyalty_discount_type: {
            type: String,
            default: 'None',
        },
        time: {
            type: Date,
            default: Date.now(),
        },
        products_purchased: {
            type: [productSchema],
            default: [],
        },
    },
    { collection: 'transactions' },
);

export const TransactionModel = model<ITransactionDocument>('Transaction', transactionSchema);