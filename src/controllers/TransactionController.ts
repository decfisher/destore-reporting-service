import { Request, Response, NextFunction } from 'express';
import { TransactionDao } from '../dao/TransactionDao';

export class TransactionController {
    private transactionDao: TransactionDao;

    constructor (transactionDao: TransactionDao) {
        this.transactionDao = transactionDao;
    }

    getTotalRevenue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { start, end } = req.query;
            const startDate = new Date(start as string);
            const endDate = new Date(end as string);

            if (endDate < startDate) throw new Error('End date must be greater than start date');

            const totalRevenue = await this.transactionDao.getTotalRevenue(startDate.toISOString(), endDate.toISOString());

            res.status(200).json({
                start: startDate,
                end: endDate,
                total_revenue: totalRevenue,
            });
        } catch (error) {
            next(error);
        }
    }

    getMostPopularProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { start, end } = req.query;
            const startDate = new Date(start as string);
            const endDate = new Date(end as string);

            if (endDate < startDate) throw new Error('End date must be greater than start date');

            const mostPopularProducts = await this.transactionDao.getMostPopularProducts(startDate.toISOString(), endDate.toISOString());

            res.status(200).json({
                start: startDate,
                end: endDate,
                most_popular_products: mostPopularProducts,
            });
        } catch (error) {
            next(error);
        }
    }

    getTotalRevenueByProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { start, end } = req.query;
            const startDate = new Date(start as string);
            const endDate = new Date(end as string);

            if (endDate < startDate) throw new Error('End date must be greater than start date');

            const totalRevenueByProduct = await this.transactionDao.getTotalRevenueByProduct(startDate.toISOString(), endDate.toISOString());

            res.status(200).json({
                start: startDate,
                end: endDate,
                total_revenue_by_product: totalRevenueByProduct,
            });
        } catch (error) {
            next(error);
        }
    }

    getDiscountUsage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { start, end } = req.query;
            const startDate = new Date(start as string);
            const endDate = new Date(end as string);

            if (endDate < startDate) throw new Error('End date must be greater than start date');

            const discountUsage = await this.transactionDao.getDiscountUsage(startDate.toISOString(), endDate.toISOString());

            res.status(200).json({
                start: startDate,
                end: endDate,
                discount_usage: discountUsage,
            });
        } catch (error) {
            next(error);
        }
    }

    getLoyaltyUsage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { start, end } = req.query;
            const startDate = new Date(start as string);
            const endDate = new Date(end as string);

            if (endDate < startDate) throw new Error('End date must be greater than start date');

            const loyaltyUsage = await this.transactionDao.getLoyaltyUsage(startDate.toISOString(), endDate.toISOString());

            res.status(200).json({
                start: startDate,
                end: endDate,
                loyalty_usage: loyaltyUsage,
            });
        } catch (error) {
            next(error);
        }
    }
}