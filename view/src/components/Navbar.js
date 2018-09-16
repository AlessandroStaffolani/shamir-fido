import React, { Component } from 'react';
import logo from '../logo.svg';
import { routes } from '../routes/routes';

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.handleLinkClick = this.handleLinkClick.bind(this);
    }

    handleLinkClick = (event, path) => {
        event.preventDefault();
    };

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarMenu"
                    aria-controls="navbarMenu"
                    aria-expanded="false"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarMenu">
                    <a className="navbar-brand" href="#!" onClick={event => this.handleLinkClick(event, 'home')}>
                        <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Logo" />
                        2FA - Shamir FIDO
                    </a>
                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">
                                Home <span className="sr-only">(current)</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
