import React, { Component } from 'react';
import logo from '../logo.svg';
import { routes, routesAsArray } from '../routes/routes';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLogged: props.userLogged,
            appRoutes: routesAsArray()
        };

        this.handleLinkClick = this.handleLinkClick.bind(this);
    }

    handleLinkClick = (event, path) => {
        event.preventDefault();
        this.props.handleLinkNavigation(path);
    };

    render() {
        const { userLogged, appRoutes } = this.state;
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
                    <a className="navbar-brand" href="#!" onClick={event => this.handleLinkClick(event, routes.home.code)} title={routes.home.title}>
                        <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Logo" />
                        {routes.home.label}
                    </a>
                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        {userLogged
                            ? appRoutes.filter(route => route.visibility === 'navbar' && route.protected).map((route, index) => (
                                  <li key={index} className="nav-item active">
                                      <a className="nav-link" href="#!" onClick={event => this.handleLinkClick(event, route.code)} title={route.title}>
                                          {route.label}
                                      </a>
                                  </li>
                              ))
                            : appRoutes.filter(route => route.visibility === 'navbar' && !route.protected).map((route, index) => (
                                  <li key={index} className="nav-item active">
                                      <a className="nav-link" href="#!" onClick={event => this.handleLinkClick(event, route.code)} title={route.title}>
                                          {route.label}
                                      </a>
                                  </li>
                              ))}
                    </ul>
                </div>
            </nav>
        );
    }
}
