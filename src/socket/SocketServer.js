const app = window.require('electron');
import config from '../config';

const PORT = config.socket.port;

class SocketServer {
    constructor() {
        this.server = null;
        this.connectedClients = {}
    }

    init() {
        
    }

    onConnection = socket => {
        console.log(socket);
    }
}