/**
 * Dependencies
 */

// Herança
import { EventEmitter, getEventListeners, captureRejectionSymbol } from 'events';

// RabbitMQ
import amqp from 'amqplib';

// RabbitMQ
import {
    RABBIT_MQ_HOST,
    RABBIT_MQ_PORT,
    RABBIT_MQ_USERNAME,
    RABBIT_MQ_PASSWORD,
    RABBIT_MQ_URL
} from '../config.js';

/**
 * Attributes
 */

const STATE = {
    STOPPING: 0,
    STOPPED: 1,
    STARTING: 2,
    STARTED: 3
};

const local = {
    config: 
    {
        WAIT_TO_RECONNECT: 5000,
        WAIT_TO_DISCONNECT: 500
    },
    events: 
    {
        captureRejectionSymbol,
        getEventListeners
    }
};

/**
 * Implementation
 */

export default class RabbitMQDefault extends EventEmitter
{

    constructor(...args)
    {
        super(...args);

        // Atributos do objeto
        this.local = {
            connection: {
                instance: null,
                available: false
            },
            channel: 
            {
                instance: null,    
                available: false
            }
        };

        this.id = Math.random().toString().replace('0.', '') + ':' + Math.random().toString().replace('0.', '');
        this.performed = false;
        this.keepAlive = true;
        this.state = STATE.STOPPED;

    }

    /***************************************************************************
     * Getters/Setters
     **************************************************************************/

    get amqp()
    {
        return amqp;
    }

    get config()
    {
        return {
            RABBIT_MQ_URL,
            config: local.config,
            events: local.events
        };
    }

    setConnection(value)
    {
        this.local.connection.instance = value;
        return this;
    }

    getConnection()
    {
        return this.local.connection.instance;
    }

    resetConnection()
    {
        this.local.connection.instance = null;
        return this;
    }

    setChannel(value)
    {
        this.local.channel.instance = value;
        return this;
    }

    getChannel()
    {
        return this.local.channel.instance;
    }

    resetChannel()
    {
        this.local.channel.instance = null;
        return this;
    }

    /***************************************************************************
     * Handlers
     **************************************************************************/

    /**
     * @description Reconstrução do estado desta classe.
     * @param  {...any} args 
     * @returns {RabbitMQDefault}
     */
    async rebuild(...args)
    {
        return this;
    }

    turnOnStopped()
    {
        this.state = STATE.STOPPED;
        return this;
    }

    get isStopped()
    {
        return this.state == STATE.STOPPED;
    }

    turnOnStarting()
    {
        this.state = STATE.STARTING;
        return this;
    }

    get isStarting()
    {
        return this.state == STATE.STARTING;
    }

    turnOnStarted()
    {
        this.state = STATE.STARTED;
        return this;
    }

    get isStarted()
    {
        return this.state == STATE.STARTED;
    }

    turnOnStopping()
    {
        this.state = STATE.STOPPING;
        return this;
    }

    get isStopping()
    {
        return this.state == STATE.STOPPING;
    }

    turnOnServerAvailable()
    {
        this.local.connection.available = true;
        return this.turnOnStarted();
    }

    turnOffServerAvailable()
    {
        this.local.connection.available = false;
        return this.turnOnStopped();
    }

    get isServerAvailable()
    {
        return this.local.connection.available;
    }

    turnOnChannelAvailable()
    {
        this.local.channel.available = true;
        return this.turnOnStarted();
    }

    turnOffChannelAvailable()
    {
        this.local.channel.available = false;
        return this.turnOnStopped();
    }

    get isChannelAvailable()
    {
        return this.local.channel.available;
    }

    turnOnKeepAlive()
    {
        this.keepAlive = true;
        return this;
    }

    turnOffKeepAlive()
    {
        this.keepAlive = false;
        return this;
    }

    get isToKeepAlive()
    {
        return this.keepAlive;
    }

}
