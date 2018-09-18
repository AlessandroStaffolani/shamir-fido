import React, { Component } from 'react';
import config from '../../config';
import { validateRegisterInput, isValidIp } from '../../validation/register';

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: '',
                device: '',
                pin: '',
                secretFile: 'Choose your secret file',
                numShards: config.shardOptions.defaultMinShards.toString()
            },
            pinDisabled: true,
            errors: {
                username: false,
                password: false,
                device: false,
                pin: false,
                secretFile: false,
                numShards: false
            }
        };

        this.secretFileInput = React.createRef();

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDeviceChange = this.handleDeviceChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    createShardOptions = () => {
        let options = [];
        for (let i = config.shardOptions.defaultMinShards; i <= config.shardOptions.maxShards; i++) {
            options.push(
                <option key={i} value={i}>
                    {i}
                </option>
            );
        }
        return options;
    };

    handleInputChange = (event, name) => {
        const { form } = this.state;
        const value = event.target.value;
        form[name] = value;
        this.setState({ form });
        if (name === 'device') {
            this.handleDeviceChange();
        }
    };

    handleDeviceChange = () => {
        const { form } = this.state;
        if (isValidIp(form.device)) {
            this.setState({ pinDisabled: false });
        } else {
            this.setState({ pinDisabled: true });
        }
    };

    handleFileChange = () => {
        const { form } = this.state;
        const file = this.secretFileInput.current.files[0];
        form.secretFile = file.name;
        this.setState({ form });
    };

    handleSubmit = event => {
        event.preventDefault();
        const { form } = this.state;
        const { errors, isValid } = validateRegisterInput(form);
        if (isValid) {
            // call submit function
            this.setState({ errors });
            this.props.handlePostSubmit(form);
        } else {
            this.setState({ errors });
        }
    };

    render() {
        const { form, errors, pinDisabled } = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username (*)</label>
                    <input
                        type="username"
                        className={errors.username ? 'form-control is-invalid' : 'form-control'}
                        id="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={event => this.handleInputChange(event, 'username')}
                    />
                    <div className="invalid-feedback">{errors.username}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password (*)</label>
                    <input
                        type="password"
                        className={errors.password ? 'form-control is-invalid' : 'form-control'}
                        id="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={event => this.handleInputChange(event, 'password')}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                    <small className="text-muted form-help">Alphanumeric password with min length of 8</small>
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
                    <small className="text-muted form-help">Add you second device ip for 2FA authentication</small>
                </div>
                <div className="form-group">
                    <label htmlFor="pin">Pin</label>
                    <input
                        type="password"
                        className={errors.pin ? 'form-control is-invalid' : 'form-control'}
                        id="pin"
                        placeholder="Pin"
                        disabled={pinDisabled}
                        value={form.pin}
                        onChange={event => this.handleInputChange(event, 'pin')}
                    />
                    <div className="invalid-feedback">{errors.pin}</div>
                    <small className="text-muted form-help">Numeric pin with lenght of 6</small>
                </div>
                <div className="form-group">
                    <div className="custom-file">
                        <input
                            type="file"
                            className={errors.secretFile ? 'custom-file-input is-invalid' : 'custom-file-input'}
                            id="secretFile"
                            ref={this.secretFileInput}
                            onChange={this.handleFileChange}
                        />
                        <label className="custom-file-label" htmlFor="secretFile">
                            {form.secretFile}
                        </label>
                        <div className="invalid-feedback">{errors.secretFile}</div>
                        <small className="text-muted form-help">Click to add your file that will be used as a secret. You will need to insert this file any times you will login as 2FA authentication.</small>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="numShards">Min number of shards (*)</label>
                    <select
                        id="numShards"
                        className={errors.numShards ? 'custom-select is-invalid' : 'custom-select'}
                        value={form.numShards}
                        onChange={event => this.handleInputChange(event, 'numShards')}
                    >
                        {this.createShardOptions()}
                    </select>
                    <div className="invalid-feedback">{errors.numShards}</div>
                    <small className="text-muted form-help">Select the minum number of shards to get master secret</small>
                </div>
                <div className="text-right">
                    <button type="submit" className="btn btn-primary">
                        Register
                    </button>
                </div>
                <hr />
                <small className="text-muted">(*) Field is required</small>
            </form>
        );
    }
}
