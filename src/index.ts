import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';

// Get environment variables
const port = process.env.PORT || 3004;

// Initialise application server
const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`🛜 Reporting service running on port ${port}...`);
});