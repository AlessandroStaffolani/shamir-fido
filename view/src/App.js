import React, { Component } from 'react';
import Navbar from './components/Navbar';
import { routes } from './routes/routes';
import Login from './components/Login';
import RegisterForm from './components/RegisterForm';
import Protected from './components/Protected';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLogged: false,
            currentPage: routes.home,
            content: ''
        };

        this.handleLinkNavigation = this.handleLinkNavigation.bind(this);
    }

    componentDidMount() {
        this.setState({ content: <Login /> });
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

    setAppContent = () => {
        const { currentPage, userLogged } = this.state;
        let content = '';
        switch (currentPage.code) {
            case routes.home.code:
                content = <Login />;
                break;
            case routes.login.code:
                content = <Login />;
                break;
            case routes.register.code:
                content = <RegisterForm />;
                break;
            case routes.protected.code:
                content = userLogged ? <Protected userLogged={userLogged} /> : <Login />;
                break;
            default:
                content = <Login />;
        }
        this.setState({ content });
    };

    render() {
        return (
            <div className="body">
                <Navbar handleLinkNavigation={this.handleLinkNavigation} userLogged={this.state.userLogged} />
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-12">
                            {this.state.content}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
