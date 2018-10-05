import React, { Component } from 'react';

export default class RegisterUsingDeviceSecond extends Component {
    constructor() {
        super();
        this.state = {
            form: {
                pin: ''
            },
            errors: {
                pin: false
            }
        };
    }

    handleInputChange = (event, name) => {
        const { form } = this.state;
        const value = event.target.value;
        form[name] = value;
        this.setState({ form });
    };

    handleSubmit = event => {
        event.preventDefault();
        const { form } = this.state;
        if (form.pin === '') {
            this.setState({
                errors: {
                    pin: 'Encryption PIN is required'
                }
            });
        } else {
            this.props.setEncryptionPin(form.pin);
        }
    };

    render() {
        const { form, errors } = this.state;
        const { submitLabel, userData } = this.props;
        const saveLabel = submitLabel || 'Save';

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Username"
                        value={userData.username}
                        onChange={event => this.handleInputChange(event, 'username')}
                        disabled={true}
                    />
                    <div className="invalid-feedback">{errors.username}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="pin">Encryption PIN</label>
                    <input
                        type="text"
                        className={errors.pin ? 'form-control is-invalid' : 'form-control'}
                        id="pin"
                        placeholder="Encryption PIN"
                        value={form.pin}
                        onChange={event => this.handleInputChange(event, 'pin')}
                    />
                    <div className="invalid-feedback">{errors.pin}</div>
                    <small className="text-muted form-help">Enter the encryption code generated on the main device</small>
                </div>
                <hr />
                <div className="text-right">
                    <button type="submit" className="btn btn-primary">
                        {saveLabel}
                    </button>
                </div>
            </form>
        );
    }
}
