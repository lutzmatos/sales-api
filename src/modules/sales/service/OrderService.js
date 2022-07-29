import { SUCCESS, INTERNAL_SERVER_ERROR, BAD_REQUEST } from './../../../config/constants/httpStatus.js';

import OrderRepository from "../repository/OrderRepository.js";
import OrderException from './../exception/OrderException.js';
import ProductClient from '../../product/client/ProductClient.js';
import { PENDING } from './../status/OrderStatus.js';

import { sendMessageToProductStockUpdateQueue } from './../../product/rabbitmq/dispatchers.js';
import { tracing } from './../../../config/tracing/helper.js';


class OrderService
{

    /**
     * @description Pesquisa de uma venda por ID.
     * @returns {JSON}
     */
    async findById(req)
    {

        try
        {
            tracing(req, 'OrderService.findById');

            const { id } = req.params;
            this.validateInformedId(id);

            const existingOrder = await OrderRepository.findById(id);
            this.validateOrder(existingOrder);

            return tracing(req, 'OrderService.findById', {
                status: 
                {
                    code: SUCCESS,
                    message: 'Ok',
                },
                result: 
                {
                    order: existingOrder
                }
            });

        }
        catch (error)
        {
            return tracing(req, 'OrderService.findById', {
                status: 
                {
                    code: error.status ? error.status : INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                result: null
            });
        }

    }

    /**
     * @description Pesquisa de uma venda por ID.
     * @returns {JSON}
     */
    async findAll(req)
    {

        try
        {

            tracing(req, 'OrderService.findAll');

            const orders = await OrderRepository.findAll();

            return tracing(req, 'OrderService.findAll', {
                status: 
                {
                    code: SUCCESS,
                    message: 'Ok',
                },
                result: 
                {
                    orders
                }
            });

        }
        catch (error)
        {
            return tracing(req, 'OrderService.findAll', {
                status: 
                {
                    code: error.status ? error.status : INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                result: null
            });
        }

    }

    /**
     * @description Pesquisa de uma venda por ID.
     * @returns {JSON}
     */
    async findByProductId(req)
    {

        try
        {

            tracing(req, 'OrderService.findByProductId');

            const { productId } = req.params;
            this.validateInformedId(productId);

            const orders = await OrderRepository.findByProductId(productId);

            return tracing(req, 'OrderService.findByProductId', {
                status: 
                {
                    code: SUCCESS,
                    message: 'Ok',
                },
                result: 
                {
                    salesIds: orders.map(
                        (order) =>
                        {
                            return order.id
                        }
                    )
                },
                salesIds: orders.map(
                    (order) =>
                    {
                        return order.id
                    }
                )
            });

        }
        catch (error)
        {
            return tracing(req, 'OrderService.findByProductId', {
                status: 
                {
                    code: error.status ? error.status : INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                result: null
            });
        }

    }

    validateInformedId(id)
    {
        if (!id)
        {
            throw new OrderException(BAD_REQUEST, 'The sale ID must be informed');
        }
    }

    /**
     * @description Pesquisa de uma venda por ID.
     * @returns {JSON}
     */
    async createOrder(req)
    {
        try
        {

            tracing(req, 'OrderService.createOrder');

            const orderData = req.body;
            this.validateOrder(orderData);

            const { authUser } = req;
            const { authorization, transactionid, serviceid } = req.headers;

            const order = this.createInitialOrderData(orderData, authUser, transactionid, serviceid);
            await this.validateProductStock(order, authorization, transactionid);

            const createdOrder = await OrderRepository.save(order);
            this.sendMessage(createdOrder, transactionid);

            return tracing(req, 'OrderService.createOrder', {
                status: 
                {
                    code: SUCCESS,
                    message: 'Ok',
                },
                result: 
                {
                    order: createdOrder
                }
            });

        }
        catch (error)
        {
            return tracing(req, 'OrderService.createOrder', {
                status: 
                {
                    code: error.status ? error.status : INTERNAL_SERVER_ERROR,
                    message: error.message,
                },
                result: null
            });
        }
    }

    createInitialOrderData(orderData, authUser, transactionid, serviceid)
    {
        return {
            products: orderData.products,
            user: authUser,
            status: PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            transactionid,
            serviceid
        };
    }

    async updateOrder(orderMessage)
    {

        try
        {

            const order = JSON.parse(orderMessage.content.toString());

            if (!order || (!order.salesId || !order.status))
            {
                throw new OrderException(BAD_REQUEST, 'The order products is invalid');
            }

            const existingOrder = await OrderRepository.findById(order.salesId);

            if (!existingOrder || (!existingOrder.products || !existingOrder.status))
            {
                throw new OrderException(BAD_REQUEST, 'The order products is invalid');
            }

            existingOrder.status = order.status;
            existingOrder.updatedAt = new Date();

            await OrderRepository.save(existingOrder);

            return true;

        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }

    validateOrder(data)
    {
        if (!data)
        {
            throw new OrderException(BAD_REQUEST, 'The data body about Produts Order must be informed');
        }
        if (!data.products)
        {
            throw new OrderException(BAD_REQUEST, 'The products must be informed');
        }
    }

    async validateProductStock(order, token, transactionid)
    {

        const stockIsOk = await ProductClient.checkProductStock(order.products, token, transactionid);

        if (!stockIsOk)
        {
            throw new OrderException(BAD_REQUEST, 'The stock is out for the products');
        }

    }

    sendMessage(createdOrder, transactionid)
    {

        const message = {
            salesId: createdOrder.id,
            products: createdOrder.products,
            transactionid
        };

        sendMessageToProductStockUpdateQueue(message);

    }

}

export default new OrderService;
