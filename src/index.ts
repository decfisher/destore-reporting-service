import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import { TransactionDao } from './dao/TransactionDao';
import { TransactionModel } from './models/transaction';
import { TransactionController } from './controllers/TransactionController';

// Get environment variables
const port = process.env.PORT || 3004;
const MONGO_DB_URI: string = process.env.DB_URI!;

// Connect to inventory database
mongoose.connect(MONGO_DB_URI)
  .then(() => console.log('✅ Connected to accounting database'))
  .catch(error => {
    console.log('❌ Failed to connect to accounting database');
    console.error(error);
  });

// Initialise data accessors
const transactionDao = new TransactionDao(TransactionModel);

// Initialise controllers
const transactionController = new TransactionController(transactionDao);

// Initialise application server
const app = express();

app.get('/total-revenue', transactionController.getTotalRevenue);

app.get('/most-popular-products', transactionController.getMostPopularProducts);

app.get('/total-revenue-by-product', transactionController.getTotalRevenueByProduct);

app.get('/discount-usage', transactionController.getDiscountUsage);

app.get('/loyalty-usage', transactionController.getLoyaltyUsage);

// Start the server
app.listen(port, () => {
    console.log(`🛜 Reporting service running on port ${port}...`);
});