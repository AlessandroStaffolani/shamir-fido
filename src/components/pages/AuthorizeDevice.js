import React, { Component } from 'react';
import SocketServer from '../../socket/SocketServer';
import authorizeDeviceController from '../../controllers/authorizeDeviceController';
import secretController from '../../controllers/secretController';
import Alert from '../base/Alert';
import config from '../../config';
import KeyField from '../Forms/KeyField';

const EVENT_NAME = config.socket.eventName;

export default class AuthorizeDevice extends Component {
    constructor() {
        super();
        this.state = {
            pin: '',
            connectedDevice: '',
            message: false
        };

        this.socketServer = null;
    }

    componentDidMount() {
        this.socketServer = new SocketServer(false);
        this.socketServer.setOnConnectionCallback(this.onConnectionCallback);
        this.socketServer.init();
    }

    componentWillUnmount() {
        this.socketServer.close();
    }

    onConnectionCallback = client => {
        console.log('Connection established with client');
        if (this.socketServer.getConnectedClient() === null) {
            this.socketServer.setConnectedClient(client);

            const pin = authorizeDeviceController.generatePin();
            this.setState({
                connectedDevice: client.handshake.address,
                pin: pin
            });
        } else {
            client.emit(EVENT_NAME, 'A client is already connected you will be ejected');
            client.disconnect();
        }
    };

    handleAuthorizeDevice = () => {
        const { connectedDevice, pin } = this.state;

        if (connectedDevice === '') {
            this.setState({
                message: {
                    type: 'warning',
                    content: (
                        <div>
                            <strong>Attention!</strong> Other device not connected
                        </div>
                    )
                }
            });
        } else {
            const newShard = secretController.generateNextShard(this.props.userData.username);
            const newShardEncrypted = authorizeDeviceController.encryptMessage(newShard, pin);

            this.socketServer.emit(newShardEncrypted);
        }
    };

    render() {
        const { connectedDevice, message, pin } = this.state;

        return (
            <div className="row">
                <div className="col-12">
                    <div className="form-wrapper">
                        <h3>Authorize other device</h3>
                        <hr />
                        <p className="text-muted">
                            Use this section to authorize a new device, we will send to the other connected device the code that will be saved in a file on your
                            new device.
                        </p>
                        <div className="row align-items-start">
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="connectedDevice">Device connected ip</label>
                                    <input type="text" disabled={true} value={connectedDevice} className="form-control" id="connectedDevice" />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <KeyField secret={pin} label="Encryption PIN" />
                            </div>
                            <div className="col-12 col-md-6 offset-md-3">
                                <button className="btn btn-primary mb-3 btn-block" onClick={this.handleAuthorizeDevice}>
                                    Send new authorization code
                                </button>
                            </div>
                        </div>
                        {message ? (
                            <div>
                                <hr />
                                <Alert type={message.type} content={message.content} />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
