import React, { Component } from 'react';
import Navbar from './components/Navbar';
import { routes } from './routes/routes';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Protected from './components/pages/Protected';
import Footer from './components/Footer';
import Alert from './components/base/Alert';
import AuthorizeDevice from './components/pages/AuthorizeDevice';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLogged: false,
            currentPage: routes.home,
            content: <Login handlePostLogin={this.handlePostLogin} />,
            message: false
        };

        this.handleLinkNavigation = this.handleLinkNavigation.bind(this);
        this.handlePostLogin = this.handlePostLogin.bind(this);
    }

    componentDidMount() {
        this.setAppContent();
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

    handlePostLogin = data => {
        localStorage.setItem(data.userData.username, data.shards);
        this.setState({
            userLogged: data.userData,
            currentPage: routes.protected,
            message: {
                type: 'success',
                dismissable: true,
                content: 'Welcome back ' + data.userData.username
            }
        });
    };

    setMessage = message => {
        this.setState({message})
    }

    setAppContent = () => {
        const { currentPage, userLogged } = this.state;
        const loginContent = <Login handlePostLogin={this.handlePostLogin} />;
        let content = '';
        switch (currentPage.code) {
            case routes.home.code:
                content = userLogged ? <Protected userData={userLogged} setMessage={this.setMessage} /> : loginContent;
                break;
            case routes.login.code:
                content = loginContent;
                break;
            case routes.register.code:
                content = <Register setShards={this.setShards} setMasterSecret={this.setMasterSecret} />;
                break;
            case routes.protected.code:
                content = userLogged ? <Protected userData={userLogged} setMessage={this.setMessage} /> : loginContent;
                break;
            case routes.authorize_device.code: 
                content = userLogged ? <AuthorizeDevice userData={userLogged} /> : loginContent;
                break;
            case routes.logout.code:
                content = loginContent;
                this.logout();
                break;
            default:
                content = loginContent;
        }
        this.setState({
            content
        });
    };

    logout = () => {
        const { userLogged } = this.state;
        localStorage.removeItem(userLogged.username);
        this.setState({ userLogged: false, message: false });
    };

    render() {
        const { message, content } = this.state;
        return (
            <div className="body">
                <Navbar handleLinkNavigation={this.handleLinkNavigation} userLogged={this.state.userLogged} />
                <div className="wrapper">
                    <div className="content">
                        <div className="container mt-5">
                            <div className="row">
                                <div className="col-12">
                                    {message ? <Alert type={message.type} dismissable={message.dismissable} content={message.content} /> : ''}
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}
