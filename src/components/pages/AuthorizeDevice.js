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
            message: {
                type: 'warning',
                content: <div>Other device not connected</div>
            }
        };

        this.socketServer = null;
    }

    componentDidMount() {
        this.socketServer = new SocketServer({ autoInit: false, secure: true });
        this.socketServer.setOnConnectionCallback(this._onConnectionCallback);
        this.socketServer.init();
    }

    componentWillUnmount() {
        this.socketServer.close();
    }

    _onConnectionCallback = client => {
        console.log('Connection established with client');
        if (this.socketServer.getConnectedClient() === null) {
            this.socketServer.setConnectedClient(client);

            const pin = authorizeDeviceController.generatePin();
            this.socketServer.setSecret(pin);

            client.on(EVENT_NAME, this._onClientMessageCallback);

            this.setState({
                connectedDevice: client.handshake.address,
                pin: pin,
                message: {
                    type: 'info',
                    content: <div>Other device connected</div>
                }
            });
        } else {
            this.socketServer.emitTo(client, { msg: 'A client is already connected you will be ejected' });
            client.disconnect();
        }
    };

    _onClientMessageCallback = message => {
        const decryptedObject = this.socketServer.decryptMessage(message, true);
        // Check if object received contain "pinReceived: true"
        if (decryptedObject.pinReceived && decryptedObject.deviceNumber !== undefined) {
            // Send shard
            this.handleAuthorizeDevice(decryptedObject.deviceNumber);
        }
    };

    handleAuthorizeDevice = deviceNumber => {
        const { connectedDevice } = this.state;

        if (connectedDevice !== '') {
            const id = parseInt(deviceNumber, 10) + 1 // +1 Because of password
            const newShard = secretController.generateNextShard(id, this.props.userData.username);
            let object = {
                shard: newShard
            };
            this.socketServer.emit(object, true);
            this.setState({
                message: {
                    type: 'success',
                    content: (
                        <div>
                            <strong>Success!</strong> New authorization code send with success
                        </div>
                    )
                }
            });
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
                            Use this section to authorize a new device, we will send you the code for the other connected device, which will be saved in a file
                            on your new device.
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
