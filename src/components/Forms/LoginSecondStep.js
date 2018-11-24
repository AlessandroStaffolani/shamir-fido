import React, { Component } from 'react';
import { validateLoginSecondStepInput } from '../../validation/loginSecondStep';
import secretController from '../../controllers/secretController';

export default class LoginSecondStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                secretFileLabel: 'Choose ...'
            },
            errors: {
                secretFileLabel: false
            },
            secretFile: null,
            userData: props.userData
        };

        this.secretFileInput = React.createRef();
    }

    handleInputChange = (event, name) => {
        const { form } = this.state;
        const value = event.target.value;
        form[name] = value;
        this.setState({ form });
    };

    handleFileChange = () => {
        const { form, secretFile } = this.state;
        const file = this.secretFileInput.current.files[0];
        if (file) {
            form.secretFileLabel = file.name;
            this.setState({
                form,
                secretFile: file
            });
        } else {
            if (secretFile === null) {
                form.secretFileLabel = 'Choose ...';
                this.setState({
                    form,
                    secretFile: null
                });
            }
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        const { form, userData, secretFile } = this.state;
        const { errors, isValid } = validateLoginSecondStepInput({ ...form, secretFile });
        if (isValid) {
            // call submit function
            this.setState({ errors });
            secretController
                .masterSecretFromPasswordAndFile(userData.password, secretFile.path)
                .then(result => {
                    this.props.handlePostSubmit({
                        success: true,
                        shards: result.shards,
                        masterSecret: result.masterSecret
                    });
                })
                .catch(err => console.log(err));
        } else {
            this.setState({ errors });
        }
    };

    render() {
        const { form, errors, userData } = this.state;
        const { submitLabel } = this.props;
        const saveLabel = submitLabel || 'Save';

        return (
            <form onSubmit={this.handleSubmit}>
                <p className="text-muted">
                    First authentication step completed. Now add your second factor to complete authentication and get access to your protected area.
                </p>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="username" className="form-control" id="username" disabled={true} placeholder="Username" value={userData.username} />
                </div>
                <div className="form-group">
                    <label htmlFor="secretFileLabel">Choose your secret file</label>
                    <div className="custom-file">
                        <input
                            type="file"
                            className={errors.secretFileLabel ? 'custom-file-input is-invalid' : 'custom-file-input'}
                            id="secretFileLabel"
                            ref={this.secretFileInput}
                            onChange={this.handleFileChange}
                        />
                        <label className="custom-file-label" htmlFor="secretFileLabel">
                            {form.secretFileLabel}
                        </label>
                        <div className="invalid-feedback">{errors.secretFileLabel}</div>
                        <small className="text-muted form-help">Click to add secret file that was created during registration</small>
                    </div>
                </div>
                <hr />
                <div className="text-right">
                    <button type="submit" className="btn btn-primary">
                        {saveLabel}
                    </button>
                </div>
            </form>
        );
    }
}
