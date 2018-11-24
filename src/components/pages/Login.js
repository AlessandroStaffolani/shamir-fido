import React, { Component } from 'react';
import LoginFirstStep from '../Forms/LoginFirstStep';
import LoginSecondStep from '../Forms/LoginSecondStep';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            finalStep: 2,
            userData: false
        };

        this.handlePostFirstStep = this.handlePostFirstStep.bind(this);
        this.handlePostSecondStep = this.handlePostSecondStep.bind(this);
    }

    handlePostFirstStep = data => {
        // Should contain current user information
        if (data.success) {
            this.setState({
                userData: data.user,
                currentStep: 2
            });
        }
    };

    handlePostSecondStep = data => {
        const { userData } = this.state;
        if (data.success) {
            this.props.handlePostLogin({
                userData,
                shards: data.shards,
                masterSecret: data.masterSecret
            });
        }
    };

    render() {
        const { currentStep, finalStep, userData } = this.state;

        return (
            <div className="row">
                <div className="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                    <div className="form-wrapper">
                        <div className="d-flex align-items-center">
                            <h3 className="d-inline-block w-50">Login</h3>
                            <span className="step-status w-50 text-right">
                                Step: {currentStep} / {finalStep}
                            </span>
                        </div>
                        <hr />
                        {currentStep === 1 ? (
                            <LoginFirstStep handlePostSubmit={this.handlePostFirstStep} submitLabel="Next" />
                        ) : currentStep === 2 ? (
                            <LoginSecondStep userData={userData} handlePostSubmit={this.handlePostSecondStep} submitLabel="Login" />
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
