import io from 'socket.io-client';
import config from '../config';
import isEmpty from '../validation/is-empty';
import { hashString, encryptString, decryptString } from '../utils/crypto-utils';

const EVENT_NAME = config.socket.eventName;

const DEFAULT_OPTIONS = {
    autoInit: true,
    secure: false
};

class SocketClient {
    constructor(host, port = 80, options = {}) {
        this.socket = io(host + ':' + port);
        this.options = isEmpty(options) ? DEFAULT_OPTIONS : options;
        if (this.options.secure) {
            this.secret = null;
        }

        this.onDataCallback = null;

        if (this.options.autoInit) {
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
        if (this.options.secure && this.secret) {
            console.log(this.decryptMessage(payload, this.secret));
        } else {
            console.log(payload);
        }
    };

    init = () => {
        this._init();
    };

    setOnDataCallback = callback => {
        this.onDataCallback = callback;
    };

    emit = (message, isObject = false) => {
        let toSendString = message;
        if (this.options.secure && this.secret) {
            if (isObject) {
                toSendString = encryptString(JSON.stringify(message), this.secret);
            } else {
                toSendString = encryptString(message, this.secret);
            }
        }
        this.socket.emit(EVENT_NAME, toSendString);
    };

    decryptMessage = (encrypted, wasObject = false) => {
        let decryptedString = decryptString(encrypted, this.secret);
        if (wasObject) {
            return JSON.parse(decryptedString);
        }
        return decryptString;
    };

    setSecret = secret => {
        if (this.options.secure) {
            this.secret = hashString(secret, 'sha256', { asBuffer: true });
        }
    };

    close() {
        this.socket.close();
    }
}

export default SocketClient;
