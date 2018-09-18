import React, { Component } from 'react';
import { validateLoginFirstStepInput } from '../../validation/loginFirstStep';

// Login first step: username and password
export default class LoginFirstStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: '',
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

    handleSubmit = (event) => {
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
    }

    render() {
        const { form, errors } = this.state;
        const { submitLabel } = this.props;
        const saveLabel = submitLabel || 'Save';

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
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
                <hr />
                <small className="text-muted">All fields are required</small>
            </form>
        );
    }
}
