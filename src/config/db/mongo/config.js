import mongoose from 'mongoose';

import  { createInitialData } from './initial.js';

import {
    MONGO_DB_URL,
    MONGO_USERNAME,
    MONGO_PASSWORD
} from '../../constants/secrets.js';

export function connectMongoDb() 
{

    mongoose.connect(
        MONGO_DB_URL,
        {
            "authSource": "admin",
            "user": MONGO_USERNAME,
            "pass": MONGO_PASSWORD,
            "useNewUrlParser": true,
            "serverSelectionTimeoutMS": 180000
            // "useUnifiedTopology": true,
            // "useCreateIndex": true,
            // "useFindAndModify": false
        }
    );

    // Escuta de conexão
    mongoose.connection.on(
        'connected',
        () =>
        {
            console.log('-------------------------------------------------');
            // console.log(MONGO_DB_URL);
            // console.log(MONGO_USERNAME);
            // console.log(MONGO_PASSWORD);
            console.log('MongoDB conectado!');
            console.log('-------------------------------------------------');
            //createInitialData();
        }
    );

    // Escuta de erro
    mongoose.connection.on(
        'error',
        (error) =>
        {
            console.log('-------------------------------------------------');
            // console.log(MONGO_DB_URL);
            // console.log(MONGO_USERNAME);
            // console.log(MONGO_PASSWORD);
            console.error(error);
            console.log('-------------------------------------------------');
        }
    );

}


