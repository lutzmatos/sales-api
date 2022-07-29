/**
 * Dependencies
 */

import RabbitMQAccess from './RabbitMQAccess.js';

/**
 * Implementation
 */

export default class RabbitMQHandler extends RabbitMQAccess
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
     * Handlers: Connection
     **************************************************************************/

    /**
     * @description Ação acionada quando uma conexão for encerrada.
     */
    connectionClose()
    {

        // Vamos imediatamente informar ao estado corrente que o servidor foi desconectado
        this.turnOffServerAvailable()

        // Vamos tentar reiniciar o objeto e as suas conexões
        .gracefullyRestart();

    }

    /**
     * @description Ação acionada quando uma conexão gerar um erro.
     */
    connectionError(error)
    {
        console.log('  -->> Connection ERROR');
        console.error(error);
    }

    /**
     * @description Ação acionada quando ...
     */
    connectionBloqued(reason)
    {
        console.log('  -->> Connection BLOQUED\n', 'reason:', reason);
    }

    /**
     * @description Ação acionada quando ...
     */
    connectionUnbloqued()
    {
        console.log('  -->> Connection UNBLOQUED');
    }

    /***************************************************************************
     * Handlers: Channel
     **************************************************************************/

    /**
     * @description Ação acionada quando um canal for encerrado.
     */
    channelClose()
    {

        // Vamos imediatamente informar ao estado corrente que o canal foi desconectado
        this.turnOffChannelAvailable();

    }

    /**
     * @description Ação acionada quando um canal gerar um erro.
     */
    channelError(error)
    {
        console.log('  ---->> Channel ERROR');
        console.error(error);
    }

    /**
     * @description Ação acionada quando ...
     */
    channelReturn(message)
    {
        console.log('  ---->> Channel RETURN\n', 'message:', message);
    }

    /**
     * @description Ação acionada quando ...
     */
    channelDrain()
    {
        console.log('  ---->> Channel DRAIN');
    }

}
