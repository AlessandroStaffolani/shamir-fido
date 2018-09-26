import React, { Component } from 'react';
import RegisterForm from '../Forms/RegisterForm';
import registerController from '../../controllers/registerController';
import config from '../../config';

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
                localStorage.setItem(config.masterSecretStorageKey, masterSecret);
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
                        <RegisterForm handlePostSubmit={this.handlePostSubmit} />
                    </div>
                </div>
            </div>
        );
    }
}
