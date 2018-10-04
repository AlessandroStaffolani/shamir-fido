import React, { Component } from 'react';

export default class Alert extends Component {
    constructor() {
        super();
        this.state = {
            visible: true
        };
    }

    closeAlert = () => {
        this.setState({ visible: false });
    };

    render() {
        const { visible } = this.state;
        let classValue = 'alert alert-' + this.props.type;
        if (this.props.dismissable) {
            classValue += ' alert-dismissible fade show';
        }
        if (visible) {
            return (
                <div className={classValue} role="alert">
                    {this.props.content}
                    {this.props.dismissable ? (
                        <button type="button" className="close" onClick={this.closeAlert}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    ) : (
                        ''
                    )}
                </div> 
            );
        } else {
            return '';
        }
    }
}
