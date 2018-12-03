import React, { Component } from 'react';
import QRCode from 'qrcode-react';
import { internal_to_QRcode } from '../../shamir/representation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faQrcode } from '@fortawesome/free-solid-svg-icons';
const { clipboard } = window.require('electron');

export default class KeyField extends Component {
    constructor() {
        super();
        this.state = {
            showQr: false
        };
    }

    copy = () => {
        clipboard.writeText(this.props.secret);
    };

    toggleQrCode = () => {
        const { showQr } = this.state;
        this.setState({ showQr: !showQr });
    };

    render() {
        const { label, info, secret } = this.props;
        return (
            <div className="key-input mb-3">
                <label htmlFor="masterSecret">{label}</label>
                <div className="row align-items-center mb-3">
                    <div className="col-8 col-md-12 col-lg-9 col-xl-9">
                        <div className="form-group m-0">
                            <input id="masterSecret" className="form-control" type="text" placeholder={secret} readOnly />
                        </div>
                    </div>
                    <div className="col-4 mt-0 mt-md-3 mt-lg-0 col-md-12 col-lg-3 col-xl-3">
                        <button className="btn btn-info mr-3" title="Copy key in your clipboard" onClick={this.copy}>
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                        <button className="btn btn-info" title="Get this key from a qrcode" onClick={this.toggleQrCode}>
                            <FontAwesomeIcon icon={faQrcode} />
                        </button>
                    </div>
                </div>
                <small className="text-muted form-help">{info}</small>
                {this.state.showQr ? (
                    <div className="text-center my-3">
                        <QRCode value={internal_to_QRcode(secret)} />
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }
}
