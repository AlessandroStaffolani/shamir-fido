import React, { Component } from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: {
                    value: '',
                    error: false
                },
                passCode: {
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
                        <h3>Login</h3>
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
                                <label htmlFor="passCode">Password or Pin</label>
                                <input
                                    type="password"
                                    className={form.passCode.error ? 'form-control is-invalid' : 'form-control'}
                                    id="passCode"
                                    placeholder="Password or Pin"
                                    value={form.passCode.value}
                                    onChange={event => this.handleInputChange(event, 'passCode')}
                                />
                                <div className="invalid-feedback">{form.passCode.error}</div>
                                <small className="text-muted form-help">Add your registration password or pin</small>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn btn-primary">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
