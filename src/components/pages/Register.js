import React, { Component } from 'react';
import RegisterFirstStep from '../Forms/RegisterFirstStep';
import secretController from '../../controllers/secretController';
import KeyField from '../Forms/KeyField';
import RegisterSecondStep from '../Forms/RegisterSecondStep';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            masterSecret: null,
            currentStep: 1,
            finalStep: 3,
            userData: null
        };
    }

    handleFirstStepSubmit = userData => {
        if (userData) {
            this.setState({
                currentStep: 2,
                userData
            })
        }
    }

    handleSecondStepSubmit = masterSecret => {
        this.setState({
            masterSecret,
            currentStep: 3
        })
    }

    handlePostSubmit = formData => {
        secretController
            .generateMasterSecret(formData)
            .then(result => {
                // localStorage.setItem(config.masterSecretStorageKey, masterSecret);
                this.setState({
                    masterSecret: result.masterSecret,
                    shares: result.shares
                });
                this.props.setShares(result.shares);
                this.props.setMasterSecret(result.masterSecret);
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        const { currentStep, finalStep, userData, masterSecret } = this.state;
        return (
            <div className="row">
                <div className="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                    <div className="form-wrapper">
                        <div className="d-flex align-items-center">
                            <h3 className="d-inline-block w-50">Register</h3>
                            <span className="step-status w-50 text-right">
                                Step: {currentStep} / {finalStep}
                            </span>
                        </div>
                        <hr />
                        {masterSecret && currentStep === 3 ? (
                            <KeyField
                                secret={masterSecret}
                                label="Your master secret"
                                info="Keep this key in a safe place. This key will be used to encrypt your file, without it you can't decrypt them."
                            />
                        ) : (
                            ''
                        )}
                        {currentStep === 1 ? (
                            <RegisterFirstStep handleSubmit={this.handleFirstStepSubmit} submitLabel={'Next'} />
                        ) : currentStep === 2 ? (
                            <RegisterSecondStep handleSubmit={this.handleSecondStepSubmit} userData={userData} submitLabel={'Generate Master Secret'} />
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
