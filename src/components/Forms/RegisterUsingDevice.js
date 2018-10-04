import React, { Component } from 'react';
import { validateRegisterInput } from '../../validation/registerUsingDevice';
import secretController from '../../controllers/secretController';

const SECOND_FACTOR_FILENAME = 'second-factor-key';

export default class RegisterUsingDevice extends Component {
    constructor() {
        super();
        this.state = {
            form: {
                username: '',
                password: '',
                device: '',
                folderInputLabel: 'Chose ...',
                secondFactorFileName: SECOND_FACTOR_FILENAME
            },
            secondFactorFolder: null,
            errors: {
                username: false,
                password: false,
                device: false,
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
            console.log(form);
        } else {
            this.setState({ errors });
        }
    };

    render() {
        const { form, errors } = this.state;
        const { submitLabel, setRegisterMode } = this.props;
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
                    <small className="text-muted form-help">Add the same username used on main device</small>
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
                    <small className="text-muted form-help">Add the same password used on main device</small>
                </div>
                <div className="form-group">
                    <label htmlFor="device">Device</label>
                    <input
                        type="device"
                        className={errors.device ? 'form-control is-invalid' : 'form-control'}
                        id="device"
                        placeholder="Device ip"
                        value={form.device}
                        onChange={event => this.handleInputChange(event, 'device')}
                    />
                    <div className="invalid-feedback">{errors.device}</div>
                    <small className="text-muted form-help">Add your main device ip</small>
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
                <hr />
                <div className="text-right">
                    <a href="#" className="btn btn-outline-secondary mr-3" onClick={(e) => setRegisterMode(e, null)}>
                        Back
                    </a>
                    <button type="submit" className="btn btn-primary">
                        {saveLabel}
                    </button>
                </div>
            </form>
        );
    }
}
