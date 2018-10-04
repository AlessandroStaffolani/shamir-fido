import React, { Component } from 'react';
import config from '../../config';
import { validateRegisterInput } from '../../validation/register';
import secretController from '../../controllers/secretController';

const SECOND_FACTOR_FILENAME = 'second-factor-key';

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: '',
                password2: '',
                folderInputLabel: 'Chose ...',
                secondFactorFileName: SECOND_FACTOR_FILENAME
            },
            secondFactorFolder: null,
            errors: {
                username: false,
                password: false,
                password2: false,
                folderInputLabel: false,
                secondFactorFileName: false
            }
        };

        this.folderInput = React.createRef();
    }

    handleInputChange = (event, name) => {
        const { form } = this.state;
        const value = event.target.value;
        form[name] = value;
        this.setState({ form });
    };

    handleFileChange = () => {
        const { secondFactorFolder, form } = this.state;

        const file = this.folderInput.current.files[0];
        if (file) {
            form.folderInputLabel = file.name;
            this.setState({
                form,
                secondFactorFolder: file
            });
        } else {
            if (secondFactorFolder === null) {
                form.folderInputLabel = 'Choose ...';
                this.setState({
                    form,
                    secondFactorFolder: null
                });
            }
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        const { form, secondFactorFolder, secondFactorFileName } = this.state;
        const { errors, isValid } = validateRegisterInput({ ...form, secondFactorFolder });
        const fileName = secondFactorFileName || SECOND_FACTOR_FILENAME;

        if (isValid) {
            // call submit function
            this.setState({ errors });
            const fileCompletePath = secondFactorFolder.path + '/' + fileName;
            let filePromise = secretController
                .createSecondFactorKeyFile(form.username, fileCompletePath)
                .then(result => result.shards)
                .catch(err => console.log(err));
            filePromise.then(shards => {
                const masterSecret = secretController.generateMasterSecret(shards);

                this.props.handleSubmit({
                    userData: {
                        username: form.username,
                        password: form.password
                    },
                    shards,
                    masterSecret
                });
            });
        } else {
            this.setState({ errors });
        }
    };

    render() {
        const { form, errors } = this.state;
        const { submitLabel } = this.props;
        const saveLabel = submitLabel || 'Save';

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className={errors.username ? 'form-control is-invalid' : 'form-control'}
                        id="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={event => this.handleInputChange(event, 'username')}
                    />
                    <div className="invalid-feedback">{errors.username}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className={errors.password ? 'form-control is-invalid' : 'form-control'}
                        id="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={event => this.handleInputChange(event, 'password')}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                    <small className="text-muted form-help">Alphanumeric password with min length of 8</small>
                </div>
                <div className="form-group">
                    <label htmlFor="password2">Confirm Password</label>
                    <input
                        type="password"
                        className={errors.password2 ? 'form-control is-invalid' : 'form-control'}
                        id="password2"
                        placeholder="Confirm Password"
                        value={form.password2}
                        onChange={event => this.handleInputChange(event, 'password2')}
                    />
                    <div className="invalid-feedback">{errors.password2}</div>
                    <small className="text-muted form-help">Write again the password that you have typed</small>
                </div>
                <div className="form-group">
                    <label htmlFor="secondFactorFolder">Chose a folder</label>
                    <div className="custom-file">
                        <input
                            type="file"
                            className={errors.folderInputLabel ? 'custom-file-input is-invalid' : 'custom-file-input'}
                            id="secondFactorFolder"
                            ref={this.folderInput}
                            onChange={this.handleFileChange}
                            webkitdirectory="true"
                        />
                        <label className="custom-file-label" htmlFor="secondFactorFolder">
                            {form.folderInputLabel}
                        </label>
                        <div className="invalid-feedback">{errors.folderInputLabel}</div>
                        <small className="text-muted form-help">
                            Click to chose a directory where we will save your second factor key file. Keep this file in a secure place on your device.
                        </small>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="secondFactorFileName">Second Factor File Name</label>
                    <input
                        type="text"
                        className={errors.secondFactorFileName ? 'form-control is-invalid' : 'form-control'}
                        id="secondFactorFileName"
                        placeholder="Second Factor File Name"
                        value={form.secondFactorFileName}
                        onChange={event => this.handleInputChange(event, 'secondFactorFileName')}
                    />
                    <div className="invalid-feedback">{errors.secondFactorFileName}</div>
                </div>
                <div className="text-right">
                    <button type="submit" className="btn btn-primary">
                        {saveLabel}
                    </button>
                </div>
            </form>
        );
    }
}
