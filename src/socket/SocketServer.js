import config from '../config';
const app = window.require('electron');
const http = app.remote.require('http');

const PORT = config.socket.port;
const EVENT_NAME = config.socket.eventName;

class SocketServer {
    constructor(autoInit = true) {
        this.server = http.createServer();
        this.connectedClient = null;
        this.io = app.remote.require('socket.io')(this.server);

        this.onConnectionCallback = null;
        this.onMessageCallback = null;

        if (autoInit) {
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
        } else {
            client.emit(EVENT_NAME, 'A client is already connected you will be ejected');
            client.disconnect();
        }
    };

    _onClientClose = () => {
        console.log('Client disconnected');
    };

    init = () => {
        this._init();
    }

    emit = message => {
        if (this.connectedClient) {
            // TODO: Message bust be encrypted
            this.connectedClient.emit(EVENT_NAME, message);
        }
    };

    getConnectedClient = () => this.connectedClient;

    setConnectedClient = client => {
        this.connectedClient = client;
    }

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
