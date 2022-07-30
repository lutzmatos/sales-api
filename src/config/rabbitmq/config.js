const env = process.env;

export const RABBIT_MQ_HOST = env.RABBIT_MQ_HOST || 'localhost';
export const RABBIT_MQ_PORT = env.RABBIT_MQ_PORT || 5672;
export const RABBIT_MQ_USERNAME = env.RABBIT_MQ_USERNAME || 'guest';
export const RABBIT_MQ_PASSWORD = env.RABBIT_MQ_PASSWORD || 'guest';

// export const RABBIT_MQ_URL = `amqp://${RABBIT_MQ_HOST}`;
export const RABBIT_MQ_URL = `amqps://whvhlikc:Kn8R9pYBAIsvCQSH2hHPgwJffmvtv5jq@stingray.rmq.cloudamqp.com/whvhlikc`;
