import React, { Component } from 'react';
import config from '../../config';
import { validateRegisterInput, isValidIp } from '../../validation/registerFirstStep';

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: '',
                password2: '',
            },
            errors: {
                username: false,
                password: false,
                password2: false
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
        const { errors, isValid } = validateRegisterInput(form);
        if (isValid) {
            // call submit function
            this.setState({ errors });
            this.props.handleSubmit({
                username: form.username,
                password: form.password,
            });
        } else {
            this.setState({ errors });
        }
    };

    render() {
        const { form, errors } = this.state;
        const { submitLabel } = this.props;
        const saveLabel = submitLabel || 'Save';

        return (
            <form onSubmit={this.handleSubmit}>
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
                    <small className="text-muted form-help">Alphanumeric password with min length of 8</small>
                </div>
                <div className="form-group">
                    <label htmlFor="password2">Confirm Password</label>
                    <input
                        type="password"
                        className={errors.password2 ? 'form-control is-invalid' : 'form-control'}
                        id="password2"
                        placeholder="Confirm Password"
                        value={form.password2}
                        onChange={event => this.handleInputChange(event, 'password2')}
                    />
                    <div className="invalid-feedback">{errors.password2}</div>
                    <small className="text-muted form-help">Write again the password that you have typed</small>
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
