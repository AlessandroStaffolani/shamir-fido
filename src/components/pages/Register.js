import React, { Component } from 'react';
import RegisterForm from '../Forms/RegisterForm';
import KeyField from '../Forms/KeyField';
import Alert from '../base/Alert';
import RegisterUsingDevice from '../Forms/RegisterUsingDevice';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            masterSecret: null,
            userData: false,
            registerMode: null // possible values: main | second
        };
    }

    setRegisterMode = (event, mode) => {
        event.preventDefault();
        this.setState({ registerMode: mode });
    };

    handleMainSubmit = data => {
        this.setState({
            userData: data.userData,
            masterSecret: data.masterSecret
        });
    };

    handleSecondSubmit = data => {
        this.setState({
            userData: data.userData,
            masterSecret: data.masterSecret
        });
    };

    render() {
        const { masterSecret, registerMode } = this.state;

        let content = '';
        if (masterSecret) {
            content = (
                <div>
                    <Alert
                        type="success"
                        dismissable={true}
                        content={
                            <div>
                                <strong className="d-block">Success! Master Secret Generated</strong>
                                <small className="form-help">
                                    This secret will be used to encrypt and decrypt your files, to regenerate it add your password and second factor file.
                                </small>
                            </div>
                        }
                    />
                    <KeyField secret={masterSecret} label="Your master secret" info="Use the button to copy on your clipboard or scan the QR-code" />
                </div>
            );
        } else if (registerMode === null) {
            content = (
                <div>
                    <p className="text-muted">
                        If you have already registered another device you can authorize it using the first one you had registered.
                        <br />
                        To do it click on the button below.
                    </p>
                    <div className="row">
                        <div className="col-12 col-md-8 offset-md-2 text-center mb-3">
                            <button className="btn btn-outline-primary btn-block" onClick={e => this.setRegisterMode(e, 'second')}>
                                Register using authorized device
                            </button>
                        </div>
                    </div>
                    <hr />
                    <p className="text-muted">Otherwise register this device as your main one</p>

                    <div className="row">
                        <div className="col-12 col-md-8 offset-md-2 text-center">
                            <button className="btn btn-outline-primary btn-block" onClick={e => this.setRegisterMode(e, 'main')}>
                                Register main device
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (registerMode === 'main') {
            content = <RegisterForm handleSubmit={this.handleMainSubmit} submitLabel={'Generate Master Secret'} setRegisterMode={this.setRegisterMode} />;
        } else if (registerMode === 'second') {
            content = (
                <RegisterUsingDevice handleSubmit={this.handleSecondSubmit} submitLabel={'Generate Master Secret'} setRegisterMode={this.setRegisterMode} />
            );
        }

        return (
            <div className="row">
                <div className="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                    <div className="form-wrapper">
                        <h3 className="mb-1">Register</h3>
                        {registerMode === 'main' ? <h6 className="d-inline-block text-muted mb-0">Main device</h6> : ''}
                        {registerMode === 'second' ? <h6 className="d-inline-block text-muted mb-0">Other device</h6> : ''}
                        <hr />
                        {content}
                    </div>
                </div>
            </div>
        );
    }
}
