/**
 * Dependencies
 */

// Inheritage
import RabbitMQChannel from './RabbitMQChannel.js';

/**
 * Attributes
 */

const TYPE = {
    DIRECT: 'direct',
    TOPIC: 'topic',
    FANOUT: 'fanout',
    HEADERS: 'headers'
};

const local = {
    exchange: 
    {
        list: []
    },
    queue: 
    {
        list: []
    },
    bind: 
    {
        list: []
    }
};

/**
 * Implementation
 */

export default class RabbitMQExchange extends RabbitMQChannel
{

    constructor(...args)
    {
        super(...args);
    }

    /***************************************************************************
     * Getters/Setters
     **************************************************************************/

    // ...

    /***************************************************************************
     * Helpers
     **************************************************************************/

    /**
     * @description Retornar os dados de uma "queue".
     * @returns {JSON}
     */
    getQueueByName(name)
    {

        for (const value of Object.values(local.queue.list))
        {
            if (value.name == name)
            {
                return value;
            }
        }

        throw new Error("The queue informed does not exists");

    }

    /***************************************************************************
     * Handlers: Exchange
     **************************************************************************/

    /**
     * @description Verificar se um "exchange" existe.
     * @returns {Boolean}
     */
    async checkExchange(name)
    {
        try
        {
            await this.getChannel().checkExchange(name);
            return true;
        }
        catch (error)
        {
            return false;
        }
    }

    /**
     * @description Criação de uma "exchange".
     * @param {String} name - Nome da "exchange".
     * @param {String} type - Tipo da "exchange".
     * @param {JSON} options - Opções de configuração da "exchange"
     * @returns {JSON}
     */
    async createExchange(name = 'N/I', type = TYPE.TOPIC, options = { durable: true })
    {

        try
        {

            // O canal é obrigatório
            this.validateChannel();

            // @todo: validar os dados

            // Vamos recuperar a configuração cadastrada
            const config = { name, type, options };

            // Vamos cadastrar o novo "exchange" na lista
            local.exchange.list.push(config);

            // Verificar se o "exchange" existe
            //const exists = await this.checkExchange(name);

            // Verificar se o "exchange" existe
            await this.getChannel().assertExchange(config.name, config.type, config.options);

            // Vamos devolver a configuração
            return {...config};

        }
        catch (error)
        {

            throw error;
        }

    }

    /***************************************************************************
     * Handlers: Queue
     **************************************************************************/

    /**
     * @description Criação de uma "queue".
     * @param {String} name - Nome da "queue".
     * @param {JSON} options - Opções de configuração da "queue"
     * @returns {JSON}
     */
    async createQueue(name = 'N/I', options = { durable: true })
    {

        try
        {

            // O canal é obrigatório
            this.validateChannel();

            // @todo: validar os dados

            // Vamos recuperar a configuração cadastrada
            const config = { name, options };

            // Vamos cadastrar o novo "exchange" na lista
            local.queue.list.push(config);

            // Verificar se o "exchange" existe
            await this.getChannel().assertQueue(config.name, config.options);

            // Vamos devolver a configuração
            return {...config};

        }
        catch (error)
        {

            throw error;
        }

    }

    /**
     * @description Criação de uma "queue".
     * @param {String} name - Nome da "queue".
     * @param {JSON} options - Opções de configuração da "queue"
     * @returns {JSON}
     */
    async bindQueue(queue = 'N/I', exchange = 'N/I', key = 'N/I')
    {

        try
        {

            // O canal é obrigatório
            this.validateChannel();

            // @todo: validar os dados

            // Vamos recuperar a configuração cadastrada
            const config = { queue, exchange, key };

            // Vamos cadastrar o novo "exchange" na lista
            local.bind.list.push(config);

            // Verificar se o "exchange" existe
            await this.getChannel().bindQueue(config.queue, config.exchange, config.key);

            // Vamos devolver a configuração
            return {...config};

        }
        catch (error)
        {
            throw error;
        }

    }

    /**
     * @description Exclusão de uma "queue".
     * @param {String} name - Nome da "queue".
     * @param {JSON} options - Opções de exclusão da "queue"
     * @returns {RabbitMQExchange}
     */
    async deleteQueue(queue = 'N/I', options = {})
    {

        try
        {

            // O canal é obrigatório
            this.validateChannel();

            // @todo: validar os dados

            // Verificar se o "exchange" existe
            await this.getChannel().deleteQueue(queue, options);

            // Fim do processo
            return this;

        }
        catch (error)
        {
            throw error;
        }

    }

    /**
     * @description Exclusão de mensagens pendentes em uma "queue".
     * @param {String} name - Nome da "queue".
     * @returns {RabbitMQExchange}
     */
    async purgeQueue(queue = 'N/I')
    {

        try
        {

            // O canal é obrigatório
            this.validateChannel();

            // @todo: validar os dados

            // Verificar se o "exchange" existe
            await this.getChannel().purgeQueue(queue);

            // Fim do processo
            return this;

        }
        catch (error)
        {
            throw error;
        }

    }

    /**
     * @description Criação de uma "queue".
     * @param {JSON} exchange - Opções de configuração da "exchange".
     * @param {JSON} queue - Opções de configuração da "queue".
     * @param {String} key - Nome da rota.
     * @returns {JSON}
     */
    async buildQueue(exchange = {}, queue = {}, key = 'N/I')
    {

        try
        {

            // O canal é obrigatório
            this.validateChannel();

            // @todo: validar os dados

            // Vamos recuperar a configuração cadastrada
            const config = { key, exchange, queue };

            // Criação do "exchange"
            await this.createExchange(
                config.exchange.name,
                config.exchange.type,
                config.exchange.options
            );

            // Criação do "queue"
            await this.createQueue(
                config.queue.name,
                config.queue.options
            );

            // Vínculo da fila com o serviço de postagem
            await this.bindQueue(
                config.queue.name,
                config.exchange.name,
                key
            );

            // Vamos devolver a configuração
            return {...config};

        }
        catch (error)
        {
            throw error;
        }

    }

    /**
     * @description Reconstrução do estado desta classe. Reinstalação das "exchanges", "queues" e "binds".
     * @param  {...any} args 
     * @returns {RabbitMQExchange}
     */
    async rebuild(...args)
    {
        await super.rebuild(...args);

        try
        {

            // Clonagem da lista de "exchanges" para recadastro
            const exchangeList = [];
            for (const config of Object.values(local.exchange.list))
            {
                exchangeList.push({name: config.name, type: config.type});
            }
            local.exchange.list = [];

            // Vamos recadastrar os "exchanges"
            for (const config of Object.values(exchangeList))
            {
                await this.createExchange(config.name, config.type, config.options);
            }

            // Clonagem da lista de "queues" para recadastro
            const queueList = [];
            for (const config of Object.values(local.exchange.list))
            {
                queueList.push({name: config.name, options: config.options});
            }
            local.queue.list = [];

            // Vamos recadastrar os "queues"
            for (const config of Object.values(queueList))
            {
                await this.createQueue(config.name, config.options);
            }

            // Clonagem da lista de "binds" para recadastro
            const bindList = [];
            for (const config of Object.values(local.bind.list))
            {
                bindList.push({queue: config.queue, exchange: config.exchange, key: config.key});
            }
            local.bind.list = [];

            // Vamos recadastrar os "binds"
            for (const config of Object.values(bindList))
            {
                await this.bindQueue(config.queue, config.exchange, config.key);
            }

            // Retorno da configuração usada
            return this;

        }
        catch (error)
        {
            throw error;
        }

    }

}
