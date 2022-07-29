import axios from 'axios';

import { PRODUCT_API_URL } from './../../../config/constants/secrets.js';

class ProductClient
{

    checkProductStock(products, token, transactionid)
    {
        return new Promise(
            (resolve, reject) =>
            {

                axios(
                    {
                        method: 'post',
                        url: `${PRODUCT_API_URL}/check-stock`,
                        headers: {
                            Authorization: `${token}`,
                            transactionid
                        },
                        data: {
                            products
                        }
                    }
                )
                .then(
                    (response) =>
                    {
                        //console.log(response.data)
                        resolve(true);
                    }
                )
                .catch(
                    (error) =>
                    {
                        //console.error(error.message)
                        resolve(false);
                    }
                );

            }
        );

    }

}

export default new ProductClient;
