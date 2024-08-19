import { Request, Response, NextFunction } from 'express';
import { TransactionDao } from '../dao/TransactionDao';

export class TransactionController {
    private transactionDao: TransactionDao;

    constructor (transactionDao: TransactionDao) {
        this.transactionDao = transactionDao;
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transactions = await this.transactionDao.getAllTransactions();
            res.status(200).json(transactions);
        } catch (error) {
            next(error);
        }
    }
}