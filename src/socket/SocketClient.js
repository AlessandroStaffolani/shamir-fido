import io from 'socket.io-client';
import config from '../config';

const EVENT_NAME = config.socket.eventName;

class SocketClient {
    constructor(host, port = 80, autoInit = true) {
        this.socket = io(host + ':' + port);

        this.onDataCallback = null;

        if (autoInit) {
            this._init();
        }
    }

    _init() {
        if (this.onDataCallback) {
            this.socket.on(EVENT_NAME, payload => this.onDataCallback(payload));
        } else {
            this.socket.on(EVENT_NAME, payload => this._onData(payload));
        }
        this.socket.on('disconnect', reason => {
            console.log('Disconnecting ...');
            console.log(reason);
        });
    }

    _onData = payload => {
        console.log(payload);
    };

    init = () => {
        this._init();
    }

    setOnDataCallback = callback => {
        this.onDataCallback = callback;
    }

    emit = message => {
        this.socket.emit(EVENT_NAME, message);
    };

    close() {
        this.socket.close();
    }
}

export default SocketClient;
