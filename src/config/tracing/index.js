import { v4 as uuid4 } from 'uuid';

import { BAD_REQUEST } from './../constants/httpStatus.js';

export default (req, res, next) =>
{

    // Recuperação do ID da transação (fluxo completo)
    const { transactionid } = req.headers;

    // ID da transação é obrigatório
    if (!transactionid)
    {
        return res.status(BAD_REQUEST).json(
            {
                status: BAD_REQUEST,
                result: {
                    message: 'The transactionid header is required'
                }
            }
        );
    }

    req.headers.serviceid = uuid4();

    return next();

};
