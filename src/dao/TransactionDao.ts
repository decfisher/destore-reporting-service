import { Model } from 'mongoose';
import { ITransactionDocument, Transaction } from '../models/transaction';

export class TransactionDao {
    private model: Model<ITransactionDocument>

    constructor (model: Model<ITransactionDocument>) {
        this.model = model;
    }

    async getAllTransactions(): Promise<Transaction[]> {
        try {
            const transactions = await this.model.find();
            return transactions.map((transaction) => {
                return {
                    id: (transaction._id as unknown) as string,
                    customer_id: transaction.customer_id,
                    total: transaction.total,
                    total_with_discount: transaction.total_with_discount,
                    delivery_charged: transaction.delivery_charged,
                    used_loyalty: transaction.used_loyalty,
                    loyalty_discount_type: transaction.loyalty_discount_type,
                    time: transaction.time,
                    products_purchased: transaction.products_purchased,
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}