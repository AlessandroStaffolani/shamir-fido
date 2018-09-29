import React, { Component } from 'react';
import Navbar from './components/Navbar';
import { routes } from './routes/routes';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Protected from './components/pages/Protected';
import Footer from './components/Footer';
import Shamir from './components/pages/Shamir';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLogged: false,
            currentPage: routes.home,
            content: <Login handlePostLogin={this.handlePostLogin} />,
            shares: [],
            originalSecret: null
        };

        this.handleLinkNavigation = this.handleLinkNavigation.bind(this);
        this.handlePostLogin = this.handlePostLogin.bind(this);
        this.setShares = this.setShares.bind(this);
        this.setOriginalSecret = this.setOriginalSecret.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.currentPage.code !== this.state.currentPage.code) {
            this.setAppContent();
        }
        if (prevState.userLogged !== this.state.userLogged) {
            this.setAppContent();
        }
    }

    handleLinkNavigation = page => {
        const { userLogged } = this.state;
        if (routes[page]) {
            if (routes[page].protected && userLogged) {
                this.setState({ currentPage: routes[page] });
            } else if (!routes[page].protected) {
                this.setState({ currentPage: routes[page] });
            } else {
                this.setState({ currentPage: routes.home.code });
            }
        } else {
            this.setState({ currentPage: routes.home.code });
        }
    };

    handlePostLogin = userData => {
        this.setState({
            userLogged: userData,
            currentPage: routes.protected
        });
    };

    setShares = shares => {
        this.setState({ shares });
    };

    setOriginalSecret = secret => {
        this.setState({ originalSecret: secret });
    };

    setAppContent = () => {
        const { currentPage, userLogged } = this.state;
        const loginContent = <Login handlePostLogin={this.handlePostLogin} />;
        let content = '';
        let updatedUserLogged = undefined;
        switch (currentPage.code) {
            case routes.home.code:
                content = userLogged ? <Protected userLogged={userLogged} /> : loginContent;
                break;
            case routes.login.code:
                content = loginContent;
                break;
            case routes.register.code:
                content = <Register setShares={this.setShares} setOriginalSecret={this.setOriginalSecret} />;
                break;
            case routes.shamir.code:
                content = <Shamir shares={this.state.shares} originalSecret={this.state.originalSecret} />;
                break;
            case routes.protected.code:
                content = userLogged ? <Protected userLogged={userLogged} /> : loginContent;
                break;
            case routes.logout.code:
                updatedUserLogged = false;
                content = loginContent;
                break;
            default:
                content = loginContent;
        }
        const user = updatedUserLogged === undefined ? userLogged : updatedUserLogged;
        this.setState({
            content,
            userLogged: user
        });
    };

    render() {
        return (
            <div className="body">
                <Navbar handleLinkNavigation={this.handleLinkNavigation} userLogged={this.state.userLogged} />
                <div className="wrapper">
                    <div className="content">
                        <div className="container mt-5">
                            <div className="row">
                                <div className="col-12">{this.state.content}</div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}
