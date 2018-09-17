import React, { Component } from 'react';

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
                pin: {
                    value: '',
                    error: false
                },
                fingerprint: {
                    value: '',
                    error: false
                }
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange = (event, name) => {
        const { form } = this.state;
        const value = event.target.value;
        form[name].value = value;
        this.setState({ form });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.form);
    }

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
                                    className={form.username.error ? "form-control is-invalid" : "form-control"}
                                    id="username"
                                    placeholder="Username"
                                    value={form.username.value}
                                    onChange={event => this.handleInputChange(event, 'username')}
                                />
                                <div className="invalid-feedback">
                                    {form.username.error}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className={form.password.error ? "form-control is-invalid" : "form-control"}
                                    id="password"
                                    placeholder="Password"
                                    value={form.password.value}
                                    onChange={event => this.handleInputChange(event, 'password')}
                                />
                                <div className="invalid-feedback">
                                    {form.password.error}
                                </div>
                                <small className="text-muted form-help">Alphanumeric password with min length of 8</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="pin">Pin</label>
                                <input
                                    type="password"
                                    className={form.pin.error ? "form-control is-invalid" : "form-control"}
                                    id="pin"
                                    placeholder="Pin"
                                    value={form.pin.value}
                                    onChange={event => this.handleInputChange(event, 'pin')}
                                />
                                <div className="invalid-feedback">
                                    {form.pin.error}
                                </div>
                                <small className="text-muted form-help">Numeric pin with lenght of 6</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="fingerprint">Fingerprint</label>
                                <div className="input-group">
                                    <input
                                        id="fingerprint"
                                        type="password"
                                        className={form.fingerprint.error ? "form-control is-invalid" : "form-control"}
                                        placeholder="Fingerprint"
                                        value={form.fingerprint.value}
                                        onChange={event => this.handleInputChange(event, 'fingerprint')}
                                    />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary" type="button">
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <div className="invalid-feedback">
                                    {form.fingerprint.error}
                                </div>
                                <small className="text-muted form-help">Click to add your finger print</small>
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
