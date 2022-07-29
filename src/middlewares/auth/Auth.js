import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import AuthException from './exception/AuthException.js';

import * as secrets from '../../config/constants/secrets.js';
import * as httpStatus from '../../config/constants/httpStatus.js';

export default async (req, res, next) =>
{

    try
    {

        const { authorization } = req.headers;

        if (!authorization)
        {
            throw new AuthException(httpStatus.UNHAUTHORIZED, 'Access denied');
        }

        let accessToken = authorization;

        if (accessToken.includes(" "))
        {
            accessToken = accessToken.split(" ")[1];
        }

        const decoded = await promisify(jwt.verify)(
            accessToken, secrets.API_SECRET
        );

        req.authUser = decoded.authUser;

        return next();

    }
    catch (error)
    {
        const status = error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR;
        return res.status(status).json(
            {
                status: 
                {
                    code: status,
                    message: error.message,
                },
                result: null
            }
        );
    }

};
