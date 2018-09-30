import React, { Component } from 'react';
import { validateLoginSecondStepInput, isValidIp } from '../../validation/loginSecondStep';

export default class LoginSecondStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                device: '',
                pin: '',
                secretFileLabel: 'Choose your secret file'
            },
            errors: {
                device: false,
                pin: false,
                secretFileLabel: false
            },
            secretFile: null,
            pinDisabled: true,
            userData: props.userData
        };

        this.secretFileInput = React.createRef();

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDeviceChange = this.handleDeviceChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

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
        const { form, secretFile } = this.state;
        const file = this.secretFileInput.current.files[0];
        if (file) {
            form.secretFileLabel = file.name;
            this.setState({
                form,
                secretFile: file
            });
        } else {
            if (secretFile === null) {
                form.secretFileLabel = 'Choose your secret file';
                this.setState({
                    form,
                    secretFile: null
                });
            }
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { form, userData, secretFile } = this.state;
        const { errors, isValid } = validateLoginSecondStepInput(form);
        if (isValid) {
            // call submit function
            this.setState({ errors });
            this.props.handlePostSubmit({
                success: true,
                user: {
                    password: userData.password,
                    device: form.device,
                    pin: form.pin,
                    secretFile
                }
            });
        } else {
            this.setState({ errors });
        }
    }

    render() {
        const { form, errors, pinDisabled, userData } = this.state;
        const { submitLabel } = this.props;
        const saveLabel = submitLabel || 'Save';

        return (
            <form onSubmit={this.handleSubmit}>
                <p>
                    First authentication step complete, now use one of the method listed below to complete your two-factor authentication and access to your protected area.
                </p>
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
                            className={errors.secretFileLabel ? 'custom-file-input is-invalid' : 'custom-file-input'}
                            id="secretFileLabel"
                            ref={this.secretFileInput}
                            onChange={this.handleFileChange}
                        />
                        <label className="custom-file-label" htmlFor="secretFileLabel">
                            {form.secretFileLabel}
                        </label>
                        <div className="invalid-feedback">{errors.secretFileLabel}</div>
                        <small className="text-muted form-help">
                            Click to add secret file that you add during registration
                        </small>
                    </div>
                </div>
                <div className="text-right">
                    <button type="submit" className="btn btn-primary">
                        {saveLabel}
                    </button>
                </div>
            </form>
        );
    }
}
