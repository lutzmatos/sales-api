/**
 * Dependencies
 */

// Inheritage
import RabbitMQHandler from './RabbitMQHandler.js';

/**
 * Implementation
 */

export default class RabbitMQConnection extends RabbitMQHandler
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
     * @description Validação do objeto de conexão.
     * @returns {RabbitMQConnection}
     */
    validateConnection()
    {

        // Objeto da conexão não existe
        if (!this.getConnection())
        {
            throw new Error('It was not possible find the connection object');
        }

        // Flag de controle indica que o servidor está desligado
        if (!this.isServerAvailable)
        {
            throw new Error('The server is offline');
        }

        return this;

    }

    /**
     * @description Validação do objeto de conexão.
     * @returns {Boolean}
     */
    isValidConnection()
    {
        try
        {
            this.validateConnection();
            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    /**
     * @description Desconfiguração da conexão.
     * @returns {RabbitMQConnection}
     */
    async configConnection()
    {

        try
        {

            // Vamos forçar a desconfiguração do estado atual
            await this.misconfigConnection();

            // Recuperação da conexão
            const connection = await this.amqp.connect(this.config.RABBIT_MQ_URL);

            // Armazenamento do estado da conexão
            this.setConnection(connection)

            // Estado interno de servidor online
            .turnOnServerAvailable();

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @description Desconfiguração da conexão.
     * @returns {RabbitMQConnection}
     */
    async misconfigConnection()
    {

        try
        {

            // Encerramento da conexão
            if (this.isValidConnection())
            {
                await this.getConnection().close();
            }

            // Estado inicial do atributo da conexão
            this.resetConnection()

            // Estado interno de servidor online
            .turnOffServerAvailable();

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @description Configuração das escutas da conexão.
     * @returns {RabbitMQConnection}
     */
    configListenConnection()
    {

        if (!this.getConnection()) return this;

        try
        {

            // Encerramento de conexão
            this.getConnection().on('close', this.connectionClose.bind(this));

            // Erro de conexão
            this.getConnection().on('error', this.connectionError.bind(this));

            // Bloqueio de conexão
            this.getConnection().on('blocked', this.connectionBloqued.bind(this));

            // Desbloqueio de conexão
            this.getConnection().on('unblocked', this.connectionUnbloqued.bind(this));

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @description Desconfiguração das escutas da conexão.
     * @returns {RabbitMQConnection}
     */
    misconfigListenConnection()
    {

        if (!this.getConnection()) return this;

        try
        {

            // Encerramento de conexão
            this.getConnection().removeAllListeners('close');

            // Erro de conexão
            this.getConnection().removeAllListeners('error');

            // Bloqueio de conexão
            this.getConnection().removeAllListeners('blocked');

            // Desbloqueio de conexão
            this.getConnection().removeAllListeners('unblocked');

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

}
