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
                const products = transaction.products_purchased.map((purchase) => {
                    return {
                        id: purchase.id,
                        name: purchase.name,
                        price: purchase.price,
                        amount_purchased: purchase.amount_purchased,
                        discount: purchase.discount,
                    }
                });

                return {
                    id: (transaction._id as unknown) as string,
                    customer_id: transaction.customer_id,
                    total: transaction.total,
                    total_with_discount: transaction.total_with_discount,
                    delivery_charged: transaction.delivery_charged,
                    used_loyalty: transaction.used_loyalty,
                    loyalty_discount_type: transaction.loyalty_discount_type,
                    time: transaction.time,
                    products_purchased: products,
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async countTransationsBetweenDates(startDate: Date, endDate: Date): Promise<number> {
        try {
            const count = await this.model.countDocuments({
                time: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                }
            });

            return count;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTotalRevenue(startDate: string, endDate: string): Promise<any> {
        try {
            const totalRevenue = await this.model.aggregate([
                {
                    $match: {
                        time: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total_revenue: { $sum: '$total_with_discount', },
                    },
                },
            ]);

            return totalRevenue.map((revenue) => {
                return {
                    total_revenue: revenue.total_revenue,
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getMostPopularProducts(startDate: string, endDate: string): Promise<any> {
        try {
            const mostPopularProducts = await this.model.aggregate([
                {
                    $match: {
                        time: { $gte: startDate, $lte: endDate }
                    }
                },
                { $unwind: '$products_purchased' },
                {
                    $group: {
                        _id: '$products_purchased.name',
                        totalPurchased: { $sum: '$products_purchased.amount_purchased', },
                    }
                },
                { $sort: { totalPurchased: -1 }, },
                { $limit: 10, },
            ]);
              

            return mostPopularProducts.map((product) => {
                return {
                    name: product._id,
                    total_purchased: product.totalPurchased,
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTotalRevenueByProduct(startDate: string, endDate: string): Promise<any> {
        try {
            const revenueByProduct = await this.model.aggregate([
                {
                    $match: {
                        time: { $gte: startDate, $lte: endDate }
                    }
                },
                { $unwind: '$products_purchased', },
                {
                    $group: {
                        _id: '$products_purchased.name',
                        totalRevenue: {
                            $sum: { 
                                $multiply: [
                                    '$products_purchased.price',
                                    '$products_purchased.amount_purchased',
                                ],
                            },
                        },
                    },
                },
                { $sort: { totalRevenue: -1, }, },
                { $limit: 10, },
            ]);

            return revenueByProduct.map((product) => {
                return {
                    name: product._id,
                    total_revenue: product.totalRevenue,
                }
            }); 
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getDiscountUsage(startDate: string, endDate: string): Promise<any> {
        try {
            const discountUsage = await this.model.aggregate([
                {
                    $match: {
                        time: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: "$discount_applied",
                        count: { $sum: 1, },
                    },
                },
                { $sort: { count: -1, }, },
            ]);

            return discountUsage.map((discount) => {
                return {
                    discount_type: discount._id,
                    count: discount.count,
                }
            })
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getLoyaltyUsage(startDate: string, endDate: string): Promise<any> {
        try {
            const loyaltyUsage = await this.model.aggregate([
                {
                    $match: {
                        time: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $match: { used_loyalty: true, },
                },
                {
                    $group: {
                        _id: "$loyalty_discount_type",
                        count: { $sum: 1, },
                    },
                },
            ]);

            return loyaltyUsage.map((loyalty) => {
                return {
                    loyalty_discount_type: loyalty._id,
                    count: loyalty.count,
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}