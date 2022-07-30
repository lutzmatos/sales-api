import Order from '../../../modules/sales/model/Order.js';

export async function createInitialData ()
{

    // Apagar os dados antigos
    await Order.collection.drop();

    // Cadastrar novos
    await Order.create(
        {
            products: 
            [
                {
                    productId: 1001,
                    quantity: 2
                },
                {
                    productId: 1002,
                    quantity: 2
                },
                {
                    productId: 1003,
                    quantity: 2
                }
            ],
            user:
            {
                id: 'abc123asd456qwer789',
                name: 'User Test',
                email: 'uset@test.com'
            },
            status: 'APPROVED',
            transactionid: 'abc-123',
            serviceid: 'abc-456',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    );
    await Order.create(
        {
            products: 
            [
                {
                    productId: 1001,
                    quantity: 1
                }
            ],
            user:
            {
                id: 'abc123asd456qwer789',
                name: 'Root',
                email: 'root@root.com'
            },
            status: 'REJECTED',
            transactionid: 'abc-123-456',
            serviceid: 'abc-456-789',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    );

};
