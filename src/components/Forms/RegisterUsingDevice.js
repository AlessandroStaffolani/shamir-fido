import React, { Component } from 'react';
import { validateRegisterInput } from '../../validation/registerUsingDevice';
import secretController from '../../controllers/secretController';
import SocketClient from '../../socket/SocketClient';
import config from '../../config';
import RegisterUsingDeviceSecond from './RegisterUsingDeviceSecond';

const SECOND_FACTOR_FILENAME = 'second-factor-key';
const SOCKET_PORT = config.socket.port;

export default class RegisterUsingDevice extends Component {
    constructor() {
        super();
        this.state = {
            form: {
                username: '',
                password: '',
                device: '',
                folderInputLabel: 'Chose ...',
                deviceNumber: 2,
                secondFactorFileName: SECOND_FACTOR_FILENAME + '-2'
            },
            secondFactorFolder: null,
            errors: {
                username: false,
                password: false,
                device: false,
                folderInputLabel: false,
                deviceNumber: false,
                secondFactorFileName: false
            },
            secondStep: false
        };

        this.folderInput = React.createRef();
        this.socketClient = null;
        this.encryptionPin = null;
    }

    componentWillUnmount() {
        if (this.socketClient) {
            this.socketClient.close();
        }
    }

    handleInputChange = (event, name) => {
        const { form } = this.state;
        const value = event.target.value;
        form[name] = value;
        this.setState({ form });
        if (name === 'deviceNumber') {
            this.handleDeviceNumberChange();
        }
    };

    handleDeviceNumberChange = () => {
        const { form } = this.state;
        const { deviceNumber, secondFactorFileName } = this.state.form;
        let splittedName = secondFactorFileName.split('-');

        if (splittedName.length === 4) {
            let defaultStringRecostruction = splittedName[0] + '-' + splittedName[1] + '-' + splittedName[2];
            if (defaultStringRecostruction === SECOND_FACTOR_FILENAME) {
                form['secondFactorFileName'] = SECOND_FACTOR_FILENAME + '-' + deviceNumber;
                this.setState({ form });
            }
        }
    };

    handleFileChange = () => {
        const { secondFactorFolder, form } = this.state;

        const file = this.folderInput.current.files[0];
        if (file) {
            form.folderInputLabel = file.name;
            this.setState({
                form,
                secondFactorFolder: file
            });
        } else {
            if (secondFactorFolder === null) {
                form.folderInputLabel = 'Choose ...';
                this.setState({
                    form,
                    secondFactorFolder: null
                });
            }
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        const { form, secondFactorFolder } = this.state;
        const { errors, isValid } = validateRegisterInput({ ...form, secondFactorFolder });

        if (isValid) {
            // call submit function
            this.setState({
                errors,
                secondStep: true
            });
            this.connectToMainDevice({ ...form, secondFactorFolder });
        } else {
            this.setState({ errors });
        }
    };

    connectToMainDevice = formData => {
        let host = 'http://' + formData.device;
        this.socketClient = new SocketClient(host, SOCKET_PORT, { autoIniti: false, secure: true });
        this.socketClient.setOnDataCallback(this._onDataCallback);
        this.socketClient.init();
    };

    _onDataCallback = payload => {
        const { secondFactorFolder, form } = this.state;
        const fileName = form.secondFactorFileName || SECOND_FACTOR_FILENAME;
        const fileCompletePath = secondFactorFolder.path + '/' + fileName;

        if (this.encryptionPin) {
            let decryptedPayload = this.socketClient.decryptMessage(payload, true);
            if (decryptedPayload.shard) {
                // We have recived the shard now we put into a file
                const shard = Buffer.from(decryptedPayload.shard, 'base64');
                secretController
                    .saveShardOnFile(shard, fileCompletePath)
                    .then(() => {
                        let shards = secretController.createShardsFromString([form.password]);
                        shards.push(shard.toString());
                        const masterSecret = secretController.generateMasterSecret(shards);
                        this.props.handleSubmit({
                            userData: {
                                username: form.username,
                                password: form.password
                            },
                            masterSecret
                        });
                    })
                    .catch(err => console.log(err));
            }
        }
    };

    setEncryptionPin = pin => {
        const { deviceNumber } = this.state.form;
        this.encryptionPin = pin;
        this.socketClient.setSecret(this.encryptionPin);
        this.socketClient.emit(
            {
                pinReceived: true,
                deviceNumber
            },
            true
        );
    };

    render() {
        const { form, errors, secondStep } = this.state;
        const { submitLabel, setRegisterMode } = this.props;
        const saveLabel = submitLabel || 'Save';

        if (secondStep) {
            return <RegisterUsingDeviceSecond userData={form} setEncryptionPin={this.setEncryptionPin} submitLabel={'Generate Master Secret'} />;
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <p className="text-muted">To perform this operation you need to be logged in the main device.</p>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className={errors.username ? 'form-control is-invalid' : 'form-control'}
                        id="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={event => this.handleInputChange(event, 'username')}
                    />
                    <div className="invalid-feedback">{errors.username}</div>
                    <small className="text-muted form-help">Add the same username used on main device</small>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className={errors.password ? 'form-control is-invalid' : 'form-control'}
                        id="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={event => this.handleInputChange(event, 'password')}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                    <small className="text-muted form-help">Add the same password used on main device</small>
                </div>
                <div className="form-group">
                    <label htmlFor="device">Device</label>
                    <input
                        type="device"
                        className={errors.device ? 'form-control is-invalid' : 'form-control'}
                        id="device"
                        placeholder="Device ip"
                        value={form.device}
                        onChange={event => this.handleInputChange(event, 'device')}
                    />
                    <div className="invalid-feedback">{errors.device}</div>
                    <small className="text-muted form-help">Add your main device IP</small>
                </div>
                <div className="form-group">
                    <label htmlFor="secondFactorFolder">Chose a folder</label>
                    <div className="custom-file">
                        <input
                            type="file"
                            className={errors.folderInputLabel ? 'custom-file-input is-invalid' : 'custom-file-input'}
                            id="secondFactorFolder"
                            ref={this.folderInput}
                            onChange={this.handleFileChange}
                            webkitdirectory="true"
                        />
                        <label className="custom-file-label" htmlFor="secondFactorFolder">
                            {form.folderInputLabel}
                        </label>
                        <div className="invalid-feedback">{errors.folderInputLabel}</div>
                        <small className="text-muted form-help">
                            Click to choose a directory where we will save your second factor key file. Keep this file in a secure place on your device.
                        </small>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="deviceNumber">Device Number</label>
                    <input
                        type="number"
                        className={errors.deviceNumber ? 'form-control is-invalid' : 'form-control'}
                        id="deviceNumber"
                        value={form.deviceNumber}
                        onChange={event => this.handleInputChange(event, 'deviceNumber')}
                    />
                    <div className="invalid-feedback">{errors.deviceNumber}</div>
                    <small className="text-muted form-help">Specify how many device you had registered including this one</small>
                </div>
                <div className="form-group">
                    <label htmlFor="secondFactorFileName">Second Factor File Name</label>
                    <input
                        type="text"
                        className={errors.secondFactorFileName ? 'form-control is-invalid' : 'form-control'}
                        id="secondFactorFileName"
                        placeholder="Second Factor File Name"
                        value={form.secondFactorFileName}
                        onChange={event => this.handleInputChange(event, 'secondFactorFileName')}
                    />
                    <div className="invalid-feedback">{errors.secondFactorFileName}</div>
                </div>
                <hr />
                <div className="text-right">
                    <a href="#" className="btn btn-outline-secondary mr-3" onClick={e => setRegisterMode(e, null)}>
                        Back
                    </a>
                    <button type="submit" className="btn btn-primary">
                        {saveLabel}
                    </button>
                </div>
            </form>
        );
    }
}
