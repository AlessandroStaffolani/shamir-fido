import React, { Component } from 'react';
import RegisterForm from '../Forms/RegisterForm';
import registerController from '../../controllers/registerController';
import config from '../../config';
import KeyField from '../Forms/KeyField';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = registerController.init();

        this.handlePostSubmit = this.handlePostSubmit.bind(this);
    }

    handlePostSubmit = formData => {
        registerController
            .generateMasterSecret(formData)
            .then(masterSecret => {
                // localStorage.setItem(config.masterSecretStorageKey, masterSecret);
                this.setState({masterSecret})
                console.log(masterSecret);
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <div className="row">
                <div className="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                    <div className="form-wrapper">
                        <h3>Register</h3>
                        <hr />
                        {this.state.masterSecret ?
                            <KeyField 
                                secret={this.state.masterSecret}
                                label="Your master secret"
                                info="Keep this key in a safe place. This key will be used to encrypt your file, without it you can't decrypt them."
                                 />
                            : ''}
                        <RegisterForm handlePostSubmit={this.handlePostSubmit} />
                    </div>
                </div>
            </div>
        );
    }
}
