/**
 * Dependencies
 */

// Inheritage
import RabbitMQExchange from './RabbitMQExchange.js';

/**
 * Attributes
 */

const local = {
    consume: 
    {
        list: []
    }
};

/**
 * Implementation
 */

export default class RabbitMQCommand extends RabbitMQExchange
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
     * Handlers
     **************************************************************************/

    /**
     * @description Instalação de um método que visa consumir uma "queue".
     * @param {String} name - Nome da "queue".
     * @returns {JSON}
     */
    async consume(queue = 'N/I', callback = () => {}, options = {durable: true})
    {

        try
        {

            // O canal é obrigatório
            this.validateChannel();

            // @todo: validar os dados

            // Configuração final
            const config = {queue, callback};

            // Vamos armazenar esta configuração
            local.consume.list.push(config);

            // Vamos recuperar a configuração cadastrada
            const result = await this.getChannel().consume(
                config.queue, 
                (message) =>
                {

                    // Método original
                    callback(message);

                    // Aviso de recebido
                    //if (options.durable || !options.noAck)
                    if (options.durable)
                    {
                        //console.log('ACK....');
                        this.getChannel().ack(message);
                    }

                }
            );

            // Retorno da configuração usada
            return {
                ...config,
                "consumerTag": result.consumerTag
            };

        }
        catch (error)
        {
            throw error;
        }

    }

    /**
     * @description Publicação de uma mensagem em um rota para um "exchange".
     * @param {String} exchange - Nome da "exchange".
     * @param {String} key - Nome da rota.
     * @param {(String|JSON)} content - Conteúdo que será enviado.
     * @param {|JSON} options - Opções de postagem.
     * @returns {JSON}
     */
    publish(exchange = 'N/I', key = 'N/I', content = {}, options = {})
    {

        try
        {

            // O canal é obrigatório
            this.validateChannel();

            // @todo: validar os dados

            // Buferização do conteúdo
            content = Buffer.from(JSON.stringify(content));

            // Vamos recuperar a configuração cadastrada
            const result = this.getChannel().publish(exchange, key, content, options);

            // Retorno da configuração usada
            return {
                ...result
            };

        }
        catch (error)
        {
            throw error;
        }

    }

    /**
     * @description Publicação de uma mensagem em um rota para um "exchange".
     * @param {String} queue - Nome da "queue".
     * @param {(String|JSON)} content - Conteúdo que será enviado.
     * @param {|JSON} options - Opções de postagem.
     * @returns {JSON}
     */
    sendToQueue(queue = 'N/I', content = {}, options = {})
    {

        try
        {

            // O canal é obrigatório
            this.validateChannel();

            // @todo: validar os dados

            // Buferização do conteúdo
            content = Buffer.from(JSON.stringify(content));

            // Vamos recuperar a configuração cadastrada
            const result = this.getChannel().sendToQueue(queue, content, options);

            // Retorno da configuração usada
            return {
                ...result
            };

        }
        catch (error)
        {
            throw error;
        }

    }

    /**
     * @description Reconstrução do estado desta classe. Reinstalação dos "cosumers".
     * @param {...any} args 
     * @returns {RabbitMQDefault}
     */
    async rebuild(...args)
    {
        await super.rebuild(...args);

        try
        {

            // Clonagem da lista de "consumers" para recadastro
            const consumeList = [];
            for (const config of Object.values(local.consume.list))
            {
                consumeList.push({queue: config.queue, callback: config.callback});
            }
            local.consume.list = [];

            // Vamos recadastrar os "consumers"
            for (const config of Object.values(consumeList))
            {
                await this.consume(config.queue, config.callback);
            }

            return this;

        }
        catch (error)
        {
            throw error;
        }

    }

}
