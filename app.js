

// import fs from 'fs';
// import util from 'util';

// fs.writeFile('channel2.txt', util.inspect(channel, { compact: false, depth: 10, breakLength: 400 }), function (err) {
//     if (err) throw err;
//     console.log('File is created successfully.');
// });

import express from "express"; 

import { connectMongoDb } from './src/config/db/mongo/config.js';
import tracing from './src/config/tracing/index.js';

import { connectRabbitMq } from './src/modules/sales/rabbitmq/init.js';
import { listenToSalesConfirmation } from './src/modules/sales/rabbitmq/listeners.js';

import middlewareAuth from './src/middlewares/auth/Auth.js';
import orderRoutes from './src/modules/sales/routes/OrderRoutes.js';

const app = express();
const env = process.env;
const PORT = env.PORT || 8082;

// Permitir respostas JSON
app.use(express.json()); 

// Usar rastreamento
app.use(tracing); 

const initRabbitMQ = async () =>
{
    await connectRabbitMq();
    await listenToSalesConfirmation();
}

connectMongoDb();
initRabbitMQ();

// Route check
app.get(
    '/api/status',
    async (req, res) => 
    {
        return res.status(200).json(
            {
                service: "Sales-API",
                status: "up",
                httpStatus: "200"
            }
        );
    }
);

// Checagem de jwt
app.use(middlewareAuth);

// Vendas
app.use(orderRoutes);

// Serviço
app.listen(
    PORT,
    () =>
    {
        console.info(`Server started successfully at port ${PORT}`);
    }
);
