/**
 * Dependencies
 */

// Inheritage
import RabbitMQConnection from './RabbitMQConnection.js';

/**
 * Implementation
 */

export default class RabbitMQChannel extends RabbitMQConnection
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
     * @description Validação do objeto do canal.
     * @returns {RabbitMQChannel}
     */
    validateChannel()
    {

        // O objeto de conexão é imprescindível
        this.validateConnection();

        // Objeto do canal não existe
        if (!this.getChannel())
        {
            throw new Error('It was not possible find the channel object');
        }

        // Flag de controle indica que o canal está desligado
        if (!this.isChannelAvailable)
        {
            throw new Error('The channel is offline');
        }

        return this;

    }

    /**
     * @description Validação do objeto do canal.
     * @returns {Boolean}
     */
    isValidChannel()
    {
        try
        {
            this.validateChannel();
            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    /**
     * @description Desconfiguração da conexão.
     * @returns {RabbitMQChannel}
     */
    async configChannel()
    {

        try
        {

            // O objeto de conexão é obrigatório
            this.validateConnection();

            // Vamos forçar a desconfiguração do estado atual
            await this.misconfigChannel();

            // Recuperação da canal
            const channel = await this.getConnection().createChannel();

            // Armazenamento do estado da canal
            this.setChannel(channel)

            // Estado interno de canal online
            .turnOnChannelAvailable();

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @description Desconfiguração da conexão.
     * @returns {RabbitMQChannel}
     */
    async misconfigChannel()
    {

        try
        {

            // Encerramento da conexão
            if (this.isValidChannel())
            {
                await this.getChannel().close();
            }

            // Estado inicial do atributo da conexão
            this.resetChannel()

            // Estado interno de canal offline
            .turnOffChannelAvailable();

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @description Configuração das escutas da conexão.
     * @returns {RabbitMQChannel}
     */
    configListenChannel()
    {

        if (!this.getChannel()) return this;

        try
        {

            // Encerramento de conexão
            this.getChannel().on('close', this.channelClose.bind(this));

            // Erro de conexão
            this.getChannel().on('error', this.channelError.bind(this));

            // Mensagem que não pôde ser roteada
            this.getChannel().on('return', this.channelReturn.bind(this));

            // Canal apto a enviar novamente
            this.getChannel().on('drain', this.channelDrain.bind(this));

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @description Desconfiguração das escutas da conexão.
     * @returns {RabbitMQChannel}
     */
    misconfigListenChannel()
    {

        if (!this.getChannel()) return this;

        try
        {

            // Encerramento de conexão
            this.getChannel().removeAllListeners('close');

            // Erro de conexão
            this.getChannel().removeAllListeners('error');

            // Bloqueio de conexão
            this.getChannel().removeAllListeners('return');

            // Desbloqueio de conexão
            this.getChannel().removeAllListeners('drain');

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

}
