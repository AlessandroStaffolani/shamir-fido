import config from '../config';
import isEmpty from '../validation/is-empty';
import { hashString, encryptString, decryptString } from '../utils/crypto-utils';
const app = window.require('electron');
const http = app.remote.require('http');

const PORT = config.socket.port;
const EVENT_NAME = config.socket.eventName;

const DEFAULT_OPTIONS = {
    autoInit: true,
    secure: false
};

class SocketServer {
    constructor(options = {}) {
        this.server = http.createServer();
        this.connectedClient = null;
        this.io = app.remote.require('socket.io')(this.server);
        this.options = isEmpty(options) ? DEFAULT_OPTIONS : options;
        if (this.options.secure) {
            this.secret = null;
        }

        this.onConnectionCallback = null;
        this.onMessageCallback = null;

        if (this.options.autoInit) {
            this._init();
        }
    }

    _init() {
        this.server.listen(PORT);
        console.log(`Listening on port ${PORT}`);

        if (this.onConnectionCallback) {
            this.io.on('connection', socket => this.onConnectionCallback(socket));
        } else {
            this.io.on('connection', socket => this._onConnection(socket));
        }

        this.io.on('close', () => this._onClientClose);
    }

    _onConnection = client => {
        console.log('Connection established with client');
        if (this.connectedClient === null) {
            this.connectedClient = client;
            this.connectedClient.on(EVENT_NAME, message => {
                if (this.options.secure && this.secret) {
                    console.log(this.decryptMessage(message));
                }
                console.log(message);
            });
        } else {
            this.emitTo(client, { msg: 'A client is already connected you will be ejected' });
            client.disconnect();
        }
    };

    _onClientClose = () => {
        console.log('Client disconnected');
    };

    init = () => {
        this._init();
    };

    emit = (message, isObject = false) => {
        if (this.connectedClient) {
            let toSendString = message;
            if (this.options.secure && this.secret) {
                if (isObject) {
                    toSendString = encryptString(JSON.stringify(message), this.secret);
                }
            }
            this.connectedClient.emit(EVENT_NAME, toSendString);
        }
    };

    emitTo = (client, message, isObject = false) => {
        if (this.connectedClient) {
            let toSendString = message;
            if (this.options.secure && this.secret) {
                if (isObject) {
                    toSendString = encryptString(JSON.stringify(message), this.secret);
                } else {
                    toSendString = encryptString(message, this.secret);
                }
            }
            client.emit(EVENT_NAME, toSendString);
        }
    };

    decryptMessage = (encrypted, wasObject = false) => {
        let decryptedString = decryptString(encrypted, this.secret);
        if (wasObject) {
            return JSON.parse(decryptedString);
        }
        return decryptString;
    };

    getConnectedClient = () => this.connectedClient;

    setConnectedClient = client => {
        this.connectedClient = client;
    };

    setSecret = secret => {
        if (this.options.secure) {
            this.secret = hashString(secret, 'sha256', { asBuffer: true });
        }
    };

    setOnConnectionCallback = callback => {
        this.onConnectionCallback = callback;
    };

    setOnMessageCallback = callback => {
        this.onMessageCallback = callback;
    };

    close = () => {
        this.io.close();
        console.log(`Stop listening on port ${PORT}`);
    };
}

export default SocketServer;
