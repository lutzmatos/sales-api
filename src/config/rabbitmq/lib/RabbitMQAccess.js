/**
 * Dependencies
 */

import RabbitMQEvent from './RabbitMQEvent.js';

/**
 * Attributes
 */

const local = {
    access: 0,
    syncs:
    []
};

/**
 * Implementation
 */

export default class RabbitMAccess extends RabbitMQEvent
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
     * @description Incremento do contador de acionamento do método sincronizador.
     * @returns {RabbitMAccess}
     */
    incSync()
    {
        local.access++;
        return this;
    }

    /**
     * @description Verificar se a ação é imediata. Neste caso o algoritmo exige que apenas o primeiro
     * acionador de sincronização execute ações imediatas.
     * @returns {Boolean}
     */
    immediateSync()
    {
        return local.access == 1;
    }

    /**
     * @description Vamos cadastrar um novo método de retorno que será chamado quando o serviço estiver online.
     * @param {Function} callback - Método de retorno.
     * @return {RabbitMAccess}
     */
    addSync(callback)
    {

        // Cadastro do método de retorno controlado pelo índice de instâncias
        local.syncs.push(
            {
                id: local.access,
                callback
            }
        );

        return this;

    }

    /**
     * @description Vamos executar todas as pendências.
     * @return {RabbitMAccess}
     */
    execSync()
    {

        // Varredura na lista de pendências
        for (const value of Object.values(local.syncs))
        {
            if (typeof value.callback == 'function') 
            {
                value.callback();
            };
        }

        // Estado inicial nos atributos de controle de pendências
        local.syncs = [];
        local.access = 0;

        return this;

    }

}
