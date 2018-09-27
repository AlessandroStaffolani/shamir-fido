import React, { Component } from 'react';
import QRCode from 'qrcode-react';
import { internal_to_QRcode } from '../../shamir/representation';
const { clipboard } = window.require('electron');

export default class KeyField extends Component {
    constructor() {
        super();
        this.state = {
            showQr: false,
        }
    }

    copy = () => {
        clipboard.writeText(this.props.secret);
    };

    toggleQrCode = () => {
        const { showQr } = this.state;
        this.setState({showQr: !showQr});
    }

    render() {
        const { label, info, secret } = this.props;
        return (
            <div className="key-input mb-3">
                <label htmlFor="masterSecret">{label}</label>
                <div className="row align-items-center mb-3">
                    <div className="col-8 col-xl-9">
                        <div className="form-group m-0">
                            <input id="masterSecret" className="form-control" type="text" placeholder={secret} readOnly />
                        </div>
                    </div>
                    <div className="col-4 col-xl-3">
                        <button className="btn btn-info mr-3" title="Copy key in your clipboard" onClick={this.copy}>
                            <i className="fas fa-copy" />
                        </button>
                        <button className="btn btn-info" title="Get this key from a qrcode" onClick={this.toggleQrCode}>
                            <i className="fas fa-qrcode" />
                        </button>
                    </div>
                </div>
                <small className="text-muted form-help">{info}</small>
                {this.state.showQr ?
                    <div className="text-center my-3">
                        <QRCode value={internal_to_QRcode(secret)} />
                    </div>
                    : ''}
            </div>
        );
    }
}
