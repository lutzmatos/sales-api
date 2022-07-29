import RabbitMQ from '../../../config/rabbitmq/lib/index.js';

// RabbitMQ
import {
    EXCHANGE_PRODUCT_TOPIC,
    //PRODUCT_STOCK_UPDATE_QUEUE,
    PRODUCT_STOCK_UPDATE_ROUTING_KEY,
    //SALES_CONFIRMATION_QUEUE,
    //SALES_CONFIRMATION_ROUTING_KEY
} from '../../config/rabbitmq.js';

export async function sendMessageToProductStockUpdateQueue(message)
{

    try
    {

        const mq = await RabbitMQ.sync();

        mq.publish(
            EXCHANGE_PRODUCT_TOPIC,
            PRODUCT_STOCK_UPDATE_ROUTING_KEY,
            message
        );

    }
    catch (error) 
    {
        console.error(error);
    }

}
