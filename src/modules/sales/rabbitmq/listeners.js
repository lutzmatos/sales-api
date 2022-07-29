import RabbitMQ from '../../../config/rabbitmq/lib/index.js';

// RabbitMQ
import {
    EXCHANGE_PRODUCT_TOPIC,
    PRODUCT_STOCK_UPDATE_QUEUE,
    PRODUCT_STOCK_UPDATE_ROUTING_KEY,
    SALES_CONFIRMATION_QUEUE,
    SALES_CONFIRMATION_ROUTING_KEY
} from '../../config/rabbitmq.js';

import OrderService from './../service/OrderService.js'

export async function listenToSalesConfirmation()
{

    try
    {

        const mq = await RabbitMQ.sync();

        await mq.consume(
            SALES_CONFIRMATION_QUEUE,
            async (message) =>
            {
                await OrderService.updateOrder(message);
            },
            // {
            //     noAck: true
            // }
        );

        // await  mq.consume(
        //     PRODUCT_STOCK_UPDATE_QUEUE,
        //     (message) =>
        //     {
        //         console.log(`PRODUCT: ${message.content.toString()}`);
        //     }
        // );

        // setTimeout(
        //     async () => 
        //     {
        //         //await mq.deleteQueue(SALES_CONFIRMATION_QUEUE, {ifUnused: true, ifEmpty: true});
        //         //await mq.purgeQueue(SALES_CONFIRMATION_QUEUE);
        //         mq.publish(
        //             EXCHANGE_PRODUCT_TOPIC, 
        //             SALES_CONFIRMATION_ROUTING_KEY,
        //             {
        //                 "to": "sales"
        //             }
        //         );
        //         mq.publish(
        //             EXCHANGE_PRODUCT_TOPIC, 
        //             PRODUCT_STOCK_UPDATE_ROUTING_KEY,
        //             {
        //                 "to": "product"
        //             }
        //         );
        //         mq.sendToQueue(
        //             SALES_CONFIRMATION_QUEUE,
        //             {
        //                 "to": "sales-queue"
        //             }
        //         );
        //         mq.sendToQueue(
        //             PRODUCT_STOCK_UPDATE_QUEUE,
        //             {
        //                 "to": "product-queue"
        //             }
        //         );
        //     },
        //     3000
        // );

    }
    catch (error) 
    {
        console.log(
            '\n',
            '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n',
            error,
            '\n',
            '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n'
        );
    }

}
