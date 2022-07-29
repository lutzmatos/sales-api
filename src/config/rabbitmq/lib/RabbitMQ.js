/**
 * Dependencies
 */

// RabbitMQ
import { RABBIT_MQ_PASSWORD } from '../config.js';
import RabbitMQCommand from './RabbitMQCommand.js';

/**
 * Attributes
 */

// ...

/**
 * Implementation
 */
class RabbitMQ extends RabbitMQCommand
{

    constructor(...args)
    {
        super(...args);
        this.installEvents();
    }

    /***************************************************************************
     * Getters/Setters
     **************************************************************************/

    // ...

    /***************************************************************************
     * Handlers
     **************************************************************************/

    /**
     * @description Construtor seguro de uma instância desta classe;
     * @returns {RabbitMQ}
     */
    static build()
    {
        return (new (this)).init();
    }

    /**
     * @desciption Centralizador da inicialização do objeto.
     * @returns {RabbitMQ}
     */
    async init()
    {

        // Fluxo normal
        try
        {

            // Finalização segura de tudo
            await this.stop();

            // Finalização segura de tudo
            await this.start();

            console.log(
                '\n',
                '###############################\n',
                'RabbitMQ conectado!\n',
                '###############################\n'
            );

        }
        catch (error)
        {

            console.log(
                '\n',
                '+++++++++++++++++++++++++++++++\n',
                'RabbitMQ desconectado!\n',
                '+++++++++++++++++++++++++++++++\n',
                error
            );

            // Tentativa de nova conexão
            await this.gracefullyRestart();

        }

        return this;

    }

    /**
     * @desciption Centralizador da finalização do objeto.
     * @returns {RabbitMQ}
     */
    async finish()
    {

        try
        {

            // Não vamos forçar a reconexão
            this.turnOffKeepAlive();

            // Finalização segura de tudo
            await this.stop();

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @desciption Inicialização segura da aplicação.
     * @returns {RabbitMQ}
     */
    async start()
    {

        try
        {

            // Vamos avisar aos clientes que o objeto está iniciado
            this.emit('starting', true);

            // Inicialização do objeto que representa a conexão
            await this.connectionStart();

            // Inicialização do objeto que representa o canal
            await this.channelStart();

            // Reconstrução dos estados
            await this.rebuild();

            // Vamos avisar aos clientes que o objeto está iniciado
            this.emit('started', true);

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @desciption Finalização segura da aplicação.
     * @returns {RabbitMQ}
     */
    async stop()
    {

        try
        {

            // Vamos avisar aos clientes que o objeto está iniciado
            this.emit('stopping', true);

            // Finalização do objeto que representa o canal
            await this.channelFinish();

            // Finalização do objeto que representa a conexão
            await this.connectionFinish();

            // Vamos avisar aos clientes que o objeto está parado
            this.emit('stoped', true);

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @desciption Inicialização segura da conexão.
     * @returns {RabbitMQ}
     */
    async connectionStart()
    {

        try
        {

            // Configuração do objeto de conexão
            await this.configConnection();

            // Configuração das escutas na conexão
            this.configListenConnection();

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @desciption Finalização segura da conexão.
     * @returns {RabbbitMQ}
     */
    async connectionFinish()
    {

        try
        {

            // Desconfiguração das escutas da conexão
            this.misconfigListenConnection();

            // Desconfiguração da conexão
            await this.misconfigConnection();

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @desciption Inicialização segura do canal.
     * @returns {RabbitMQ}
     */
    async channelStart()
    {

        try
        {

            // Configuração do objeto do canal
            await this.configChannel();

            // Configuração das escutas no canal
            this.configListenChannel();

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @desciption Finalização segura do canal.
     * @returns {RabbbitMQ}
     */
    async channelFinish()
    {

        try
        {

            // Desconfiguração das escutas do canal
            this.misconfigListenChannel();

            // Desconfiguração da canal
            await this.misconfigChannel();

        }
        catch (error)
        {
            throw error;
        }

        return this;

    }

    /**
     * @desciption Reinicialização segura do objeto.
     * @returns {RabbitMQ}
     */
    gracefullyRestart()
    {

        // Reinicialização inibida
        if (!this.isToKeepAlive) return this;

        // Vamos aguardar alguns segundos e tentar conectar novamente
        setTimeout(
            async () =>
            {
                await this.init();
            },
            this.config.config.WAIT_TO_RECONNECT
        );

        return this;

    }

    /**
     * @description Sincronizador de inicialização do objeto.
     * @returns {Promise}
     */
    sync()
    {

        // Vamos contabilizar o acesso
        this.incSync();

        // Processamento
        return new Promise(
            async (resolve, reject) => 
            {

                try
                {

                    // Serviço já iniciado
                    if (this.isStarted)
                    {
                        return resolve(this);
                    }

                    // O acesso que permite ação imediata
                    if (this.immediateSync())
                    {
                        return resolve(await this.init());
                    }

                    // Os demais acessos quando o serviço não está iniciado deverão aguardar o devido retorno
                    else
                    {
                        this.addSync(() => (resolve(this)));
                    }

                }
                catch (error)
                {
                    reject(error);
                }

            }
        );
    }

}

export default RabbitMQ;
