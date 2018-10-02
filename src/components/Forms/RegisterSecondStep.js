import React, { Component } from 'react';
import secretController from '../../controllers/secretController';
import Alert from '../base/Alert';

const SECOND_FACTOR_FILENAME = 'second-factor-key';

export default class RegisterSecondStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: props.userData,
            submitDisabled: true,
            secondFactorFolder: null,
            folderInputLabel: 'Chose ...',
            errors: false,
            generatingState: 0, // 0 = not show, -1 = generating, 1 = generated
            secondFactorFileName: SECOND_FACTOR_FILENAME,
            disabledInput: false
        };
        this.folderInput = React.createRef();
    }

    handleInputChange = (event, name) => {
        const { form } = this.state;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    };

    handleFileChange = () => {
        const { secondFactorFolder } = this.state;

        const file = this.folderInput.current.files[0];
        if (file) {
            this.setState(
                {
                    folderInputLabel: file.name,
                    secondFactorFolder: file,
                    generatingState: -1,
                    disabledInput: true
                },
                this.generateSecondFactorFile
            );
        } else {
            if (secondFactorFolder === null) {
                this.setState({
                    folderInputLabel: 'Choose your secret file',
                    secondFactorFolder: null,
                    generatingState: 0,
                    disabledInput: false
                });
            }
        }
    };

    generateSecondFactorFile = () => {
        const { userData, secondFactorFolder, secondFactorFileName } = this.state;
        const fileName = secondFactorFileName || SECOND_FACTOR_FILENAME;
        const fileCompletePath = secondFactorFolder.path + '/' + fileName;

        secretController
            .createSecondFactorKeyFile(userData.password, fileCompletePath)
            .then(result => {
                localStorage.setItem(userData.username, result.shards);
                this.setState({
                    generatingState: 1,
                    submitDisabled: false
                });
            })
            .catch(err => console.log(err));
    };

    handleSubmit = event => {
        event.preventDefault();
        const { submitDisabled, userData, secondFactorFolder, secondFactorFileName } = this.state;
        const fileName = secondFactorFileName || SECOND_FACTOR_FILENAME;
        const fileCompletePath = secondFactorFolder.path + '/' + fileName;

        if (!submitDisabled) {
            //this.props.handleSubmit(secretController.masterSecretFromLocalStorage(userData.username));
            secretController.masterSecretFromPasswordAndFile(userData.password, fileCompletePath)
                .then(masterSecret => {
                    this.props.handleSubmit(masterSecret);
                })
                .catch(err => console.log(err))
        }
    };

    render() {
        const { userData, errors, submitDisabled, folderInputLabel, generatingState, secondFactorFolder, secondFactorFileName, disabledInput } = this.state;
        const { submitLabel } = this.props;
        const saveLabel = submitLabel || 'Save';
        const fileName = secondFactorFileName || SECOND_FACTOR_FILENAME;

        let generatingAlert = '';
        if (generatingState === -1) {
            generatingAlert = (
                <Alert
                    type="warning"
                    dismissable={true}
                    content={
                        <div>
                            <strong className="d-block">Generating second factor key file!</strong>
                            <small className="form-help">{secondFactorFolder ? secondFactorFolder.path + '/' + fileName : ''}</small>
                        </div>
                    }
                />
            );
        } else if (generatingState === 1) {
            generatingAlert = (
                <Alert
                    type="success"
                    dismissable={true}
                    content={
                        <div>
                            <strong className="d-block">Second factor key file generated!</strong>
                            <small className="form-help">Path: {secondFactorFolder ? secondFactorFolder.path + '/' + fileName : ''}</small>
                            <p className="my-3">
                            Now you can generate master secret
                            </p>
                        </div>
                    }
                />
            );
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <p>First step on register complete, now get the second factor key file to generate your private master secret</p>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="username" className="form-control" id="username" disabled={true} placeholder="Username" value={userData.username} />
                </div>
                <div className="form-group">
                    <label htmlFor="secondFactorFolder">Chose a folder</label>
                    <div className="custom-file">
                        <input
                            type="file"
                            className={errors ? 'custom-file-input is-invalid' : 'custom-file-input'}
                            id="secondFactorFolder"
                            ref={this.folderInput}
                            onChange={this.handleFileChange}
                            webkitdirectory="true"
                            disabled={disabledInput}
                        />
                        <label className="custom-file-label" htmlFor="secondFactorFolder">
                            {folderInputLabel}
                        </label>
                        <div className="invalid-feedback">{errors}</div>
                        <small className="text-muted form-help">
                            Click to chose a directory where we will save your second factor key file. Keep this file in a secure place in your device.
                        </small>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="secondFactorFileName">Second Factor File Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="secondFactorFileName"
                        placeholder="Second Factor File Name"
                        value={secondFactorFileName}
                        disabled={disabledInput}
                        onChange={event => this.handleInputChange(event, 'secondFactorFileName')}
                    />
                </div>
                {generatingAlert}
                <div className="text-right">
                    <button type="submit" disabled={submitDisabled} className="btn btn-primary">
                        {saveLabel}
                    </button>
                </div>
            </form>
        );
    }
}
