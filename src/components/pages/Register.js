import React, { Component } from 'react';
import RegisterForm from '../Forms/RegisterForm';
import KeyField from '../Forms/KeyField';
import Alert from '../base/Alert';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            masterSecret: null,
            currentStep: 1,
            finalStep: 3,
            userData: false
        };
    }

    handlePostSubmit = data => {
        this.setState({
            userData: data.userData,
            masterSecret: data.masterSecret
        });
    };

    render() {
        const { masterSecret } = this.state;
        return (
            <div className="row">
                <div className="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                    <div className="form-wrapper">
                        <h3>Register</h3>
                        <hr />
                        {masterSecret ? (
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
                                <KeyField
                                    secret={masterSecret}
                                    label="Your master secret"
                                    info="Use the button to copy on your clipboard or scan the QR-code"
                                />
                            </div>
                        ) : (
                            <RegisterForm handleSubmit={this.handlePostSubmit} submitLabel={'Generate Master Secret'} />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
