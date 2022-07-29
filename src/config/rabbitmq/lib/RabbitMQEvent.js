/**
 * Dependencies
 */

// Inheritage
import RabbitMQDefault from './RabbitMQDefault.js';

/**
 * Implementation
 */

export default class RabbitMQEvent extends RabbitMQDefault
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
     * @description Instalação de eventos.
     * @returns {RabbitMQEvent}
     */
    installEvents()
    {
        this.on(
            'starting', 
            () => 
            {
                this.turnOnStarting();
                // console.log('  ==> starting...')
            }
        );
        this.on(
            'started', 
            () => 
            {
                this.turnOnStarted()
                .execSync();
                // console.log('  ==> started...');
            }
        );
        this.on(
            'stopping', 
            () => 
            {
                this.turnOnStopping();
                // console.log('  ==> stopping...');
            }
        );
        this.on(
            'stoped', 
            () => 
            {
                this.turnOnStopped();
                // console.log('  ==> stoped...');
            }
        );
    }

    /**
     * @description Desinstalação de eventos internos.
     * @returns {RabbitMQEvent}
     */
    unninstallEvents()
    {

        this.removeAllListeners('starting');
        this.removeAllListeners('started');
        this.removeAllListeners('stopping');
        this.removeAllListeners('stoped');

        return this;

    }

}
