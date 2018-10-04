import React, { Component } from 'react';
import { validateLoginFirstStepInput } from '../../validation/loginFirstStep';

// Login first step: username and password
export default class LoginFirstStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: ''
            },
            errors: {
                username: false,
                password: false
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        const { errors, isValid } = validateLoginFirstStepInput(form);
        if (isValid) {
            // call submit function
            this.setState({ errors });
            this.props.handlePostSubmit({
                success: true,
                user: form
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
                <p className="text-muted">
                    The login process allow you to regenerate your registered master secret, but never falls, it always generate a secret, be sure to set the
                    right authenticator.
                </p>
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
                    <small className="text-muted form-help">Add your registration password</small>
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
