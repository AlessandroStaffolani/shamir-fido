import React, { Component } from 'react';
import RegisterForm from '../Forms/RegisterForm';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {}
        };

        this.handlePostSubmit = this.handlePostSubmit.bind(this);
    }

    handlePostSubmit = formData => {
        console.log(formData);
        this.setState({ formData });
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
