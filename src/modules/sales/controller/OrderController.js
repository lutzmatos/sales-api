import OrderService from './../service/OrderService.js';

class OrderController
{

    async createOrder(req, res)
    {
        const result = await OrderService.createOrder(req);
        return res.status(result.status.code).json(result);
    }

    async findById(req, res)
    {
        const result = await OrderService.findById(req);
        return res.status(result.status.code).json(result);
    }

    async findAll(req, res)
    {
        console.log('+++++++++++++++++++++++++++++++ findAll');
        const result = await OrderService.findAll(req);
        return res.status(result.status.code).json(result);
    }

    async findByProductId(req, res)
    {
        const result = await OrderService.findByProductId(req);
        return res.status(result.status.code).json(result);
    }

}

export default new OrderController;
