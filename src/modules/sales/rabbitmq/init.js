import RabbitMQ from '../../../config/rabbitmq/lib/index.js';

// RabbitMQ
import {
    EXCHANGE_PRODUCT_TOPIC,
    PRODUCT_STOCK_UPDATE_QUEUE,
    PRODUCT_STOCK_UPDATE_ROUTING_KEY,
    SALES_CONFIRMATION_QUEUE,
    SALES_CONFIRMATION_ROUTING_KEY
} from '../../config/rabbitmq.js';

export async function connectRabbitMq()
{
    try
    {
        // const mq = new RabbitMQ;
        // await mq.init();
        const mq = await RabbitMQ.sync();
        // const exchange = await mq.createExchange(EXCHANGE_PRODUCT_TOPIC, 'topic', { durable: true });
        // const queue1 = await mq.createQueue(PRODUCT_STOCK_UPDATE_QUEUE, { durable: true });
        // const queue2 = await mq.createQueue(SALES_CONFIRMATION_QUEUE, { durable: true });
        // const bind1 = await mq.bindQueue(queue1.name, exchange.name, PRODUCT_STOCK_UPDATE_ROUTING_KEY);
        // const bind2 = await mq.bindQueue(queue2.name, exchange.name, SALES_CONFIRMATION_ROUTING_KEY);
        await mq.buildQueue(
            {
                name: EXCHANGE_PRODUCT_TOPIC,
                type: 'topic',
                options: 
                {
                    durable: true
                }
            },
            {
                name: PRODUCT_STOCK_UPDATE_QUEUE,
                options: 
                {
                    durable: true
                }
            },
            PRODUCT_STOCK_UPDATE_ROUTING_KEY
        );
        await mq.buildQueue(
            {
                name: EXCHANGE_PRODUCT_TOPIC,
                type: 'topic',
                options: 
                {
                    durable: true
                }
            },
            {
                name: SALES_CONFIRMATION_QUEUE,
                options: 
                {
                    durable: true
                }
            },
            SALES_CONFIRMATION_ROUTING_KEY
        );

        // console.log(exchange);
        // console.log(queue1);
        // console.log(queue2);
        // console.log(bind1);
        // console.log(bind2);

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
