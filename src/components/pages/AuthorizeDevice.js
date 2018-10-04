import React, { Component } from 'react';
import Alert from '../base/Alert';

export default class AuthorizeDevice extends Component {
    constructor() {
        super();
        this.state = {
            connectedDevice: '',
            message: false
        };
    }

    handleAuthorizeDevice = () => {
        const { connectedDevice } = this.state;

        if (connectedDevice === '') {
            this.setState({
                message: {
                    type: 'warning',
                    content: (
                        <div>
                            <strong>Attention!</strong> Other device not connected
                        </div>
                    )
                }
            });
        }
    };

    render() {
        const { connectedDevice, message } = this.state;

        return (
            <div className="row">
                <div className="col-12">
                    <div className="form-wrapper">
                        <h3>Authorize other device</h3>
                        <hr />
                        <p className="text-muted">
                            Use this section to authorize a new device, we will send to the other connected device the code that will be saved in a file on your
                            new device.
                        </p>
                        <div className="row align-items-end">
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="connectedDevice">Device connected ip</label>
                                    <input type="text" disabled={true} value={connectedDevice} className="form-control" id="connectedDevice" />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <button className="btn btn-primary mb-3" onClick={this.handleAuthorizeDevice}>Send new authorization code</button>
                            </div>
                        </div>
                        {message ? (
                            <div>
                                <hr />
                                <Alert type={message.type} content={message.content} />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
