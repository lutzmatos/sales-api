const env = process.env;

export const API_SECRET = env.API_SECRET
    ? env.API_SECRET
    : "YmlzY29pdG8tbW9saGFkby1uYW8tc2UtY29tZQ==";

/*******************************************************************************
 * MongoDB
 ******************************************************************************/

export const MONGO_HOST = env.MONGO_HOST || 'localhost';
export const MONGO_PORT = env.MONGO_PORT || '27017';
export const MONGO_DB = env.MONGO_DB || 'sales-db';
export const MONGO_USERNAME = env.MONGO_USERNAME || 'admin';
export const MONGO_PASSWORD = env.MONGO_PASSWORD || 'admin';
export const MONGO_DB_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?retryWrites=true&w=majority`;
// export const MONGO_DB_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

/*******************************************************************************
 * API: Product
 ******************************************************************************/

export const JAVA_PRODUCT_HOST = env.JAVA_PRODUCT_HOST || 'localhost';
export const JAVA_PRODUCT_PORT = env.JAVA_PRODUCT_PORT || '8081';
export const PRODUCT_API_URL = `http://${JAVA_PRODUCT_HOST}:${JAVA_PRODUCT_PORT}/api/product`;
