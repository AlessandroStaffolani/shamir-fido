import React, { Component } from 'react';
import KeyField from '../Forms/KeyField';
import { combine, newShare } from '../../shamir';
import { internal_to_textField } from '../../shamir/representation';

export default class Shamir extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shares: props.shares,
            selectedShares: this.setSelectedSharesValues(props.shares),
            masterSecret: props.masterSecret,
            generatedSecret: null
        };
    }

    setSelectedSharesValues = shares => {
        let selectedValues = [];
        shares.map(() => selectedValues.push(false));
        return selectedValues;
    };

    handleShareSelection = shareIndex => {
        const { selectedShares } = this.state;
        selectedShares[shareIndex] = !selectedShares[shareIndex];
        this.setState({ selectedShares });
    };

    handleCombine = () => {
        const sharesToCombine = [];
        const { shares, selectedShares } = this.state;
        shares.map((share, i) => {
            if (selectedShares[i]) {
                sharesToCombine.push(share);
            }
        });
        const generatedSecret = internal_to_textField(combine(sharesToCombine));
        this.setState({ generatedSecret: generatedSecret.length > 0 ? generatedSecret : '' });
    };

    handleAddNewShare = e => {
        e.preventDefault();
        let newShard = newShare(this.state.shares.length + 1, this.state.shares);

        const { shares, selectedShares } = this.state;
        shares.push(newShard);
        selectedShares.push(false);
        this.setState({ shares, selectedShares });
    };

    handleSelectAllShares = e => {
        e.preventDefault();
        const { selectedShares } = this.state;
        this.setState({
            selectedShares: selectedShares.map(share => true)
        });
    };

    render() {
        const { shares, selectedShares, masterSecret, generatedSecret } = this.state;

        if (masterSecret) {
            return (
                <div className="row">
                    <div className="col-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2">
                        <div className="form-wrapper">
                            <h3>Shamir Secret Sharing</h3>
                            <hr />
                            <div className="text-center my-3">
                                <KeyField secret={masterSecret} label="Your master secret" />
                            </div>
                            <div className="text-center my-3">
                                <KeyField secret={generatedSecret} label="Your combined secret" />
                            </div>
                            {generatedSecret && masterSecret ? (
                                <div className="text-center">
                                    {masterSecret === generatedSecret ? (
                                        <div className="alert alert-success " role="alert">
                                            The 2 secrets match
                                        </div>
                                    ) : (
                                        <div className="alert alert-danger " role="alert">
                                            The 2 secrets are not the same
                                        </div>
                                    )}
                                </div>
                            ) : (
                                ''
                            )}
                            <hr />
                            <div className="text-center">
                                <button className="btn btn-primary" onClick={this.handleCombine}>
                                    Combine Selected Shares
                                </button>
                            </div>
                            <hr />
                            <h6>Your available shares</h6>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Share</th>
                                            <th className="text-center">Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shares.map((share, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>
                                                    <label htmlFor={'selectShare-' + (i + 1)}>{share}</label>
                                                </td>
                                                <td className="text-center">
                                                    <div className="form-group form-check mb-0">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={selectedShares[i]}
                                                            id={'selectShare-' + (i + 1)}
                                                            onChange={() => this.handleShareSelection(i)}
                                                        />
                                                        <label />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr />
                            <div className="text-right">
                                <button className="btn btn-outline-secondary mr-3" onClick={this.handleAddNewShare}>
                                    Add new shares
                                </button>
                                <button className="btn btn-outline-secondary" onClick={this.handleSelectAllShares}>
                                    Select all shares
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="col-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2">
                        <div className="form-wrapper">
                            <h3>Shamir Secret Sharing</h3>
                            <hr />
                            <div className="text-center ">
                                <div className="alert alert-warning" role="alert">
                                    You don't have created a master secret! Go to register page
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
