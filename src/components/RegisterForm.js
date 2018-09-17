import React, { Component } from 'react';

const SHARDS_OPTIONS = {
    maxShards: 3,
    defaultMinShards: 2
};

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: {
                    value: '',
                    error: false
                },
                password: {
                    value: '',
                    error: false
                },
                device: {
                    value: '',
                    error: false
                },
                pin: {
                    value: '',
                    error: false,
                    disabled: true
                },
                secretFile: {
                    file: null,
                    error: false,
                    label: 'Choose your secret file'
                },
                numShards: {
                    value: SHARDS_OPTIONS.defaultMinShards,
                    error: false
                }
            }
        };
        this.secretFileInput = React.createRef();

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    createShardOptions = () => {
        let options = [];
        for (let i = SHARDS_OPTIONS.defaultMinShards; i <= SHARDS_OPTIONS.maxShards; i++) {
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
        form[name].value = value;
        this.setState({ form });
    };

    handleFileChange = () => {
        const { form } = this.state;
        const file = this.secretFileInput.current.files[0];
        form.secretFile.file = file;
        form.secretFile.label = file.name;
        this.setState({ form });
    };

    handleSubmit = event => {
        event.preventDefault();
        console.log(this.state.form);
    };

    render() {
        const { form } = this.state;

        return (
            <div className="row">
                <div className="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                    <div className="form-wrapper">
                        <h3>Register</h3>
                        <hr />
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="username"
                                    className={form.username.error ? 'form-control is-invalid' : 'form-control'}
                                    id="username"
                                    placeholder="Username"
                                    value={form.username.value}
                                    onChange={event => this.handleInputChange(event, 'username')}
                                />
                                <div className="invalid-feedback">{form.username.error}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className={form.password.error ? 'form-control is-invalid' : 'form-control'}
                                    id="password"
                                    placeholder="Password"
                                    value={form.password.value}
                                    onChange={event => this.handleInputChange(event, 'password')}
                                />
                                <div className="invalid-feedback">{form.password.error}</div>
                                <small className="text-muted form-help">Alphanumeric password with min length of 8</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="device">Device</label>
                                <input
                                    type="device"
                                    className={form.device.error ? 'form-control is-invalid' : 'form-control'}
                                    id="device"
                                    placeholder="Device ip"
                                    value={form.device.value}
                                    onChange={event => this.handleInputChange(event, 'device')}
                                />
                                <div className="invalid-feedback">{form.device.error}</div>
                                <small className="text-muted form-help">Add you second device ip for 2FA authentication</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="pin">Pin</label>
                                <input
                                    type="password"
                                    className={form.pin.error ? 'form-control is-invalid' : 'form-control'}
                                    id="pin"
                                    placeholder="Pin"
                                    disabled={form.pin.disabled}
                                    value={form.pin.value}
                                    onChange={event => this.handleInputChange(event, 'pin')}
                                />
                                <div className="invalid-feedback">{form.pin.error}</div>
                                <small className="text-muted form-help">Numeric pin with lenght of 6</small>
                            </div>
                            <div className="form-group">
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        className={form.secretFile.error ? 'custom-file-input is-invalid' : 'custom-file-input'}
                                        id="secretFile"
                                        ref={this.secretFileInput}
                                        onChange={this.handleFileChange}
                                    />
                                    <label className="custom-file-label" htmlFor="secretFile">
                                        {form.secretFile.label}
                                    </label>
                                    <div className="invalid-feedback">{form.secretFile.error}</div>
                                    <small className="text-muted form-help">Click to add your file with a secret</small>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="numShards">Min number of shards</label>
                                <select
                                    id="numShards"
                                    className={form.numShards.error ? 'custom-select is-invalid' : 'custom-select'}
                                    value={form.numShards.value}
                                    onChange={event => this.handleInputChange(event, 'numShards')}
                                >
                                    {this.createShardOptions()}
                                </select>
                                <div className="invalid-feedback">{form.numShards.error}</div>
                                <small className="text-muted form-help">Select the minum number of shards to get master secret</small>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn btn-primary">
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
