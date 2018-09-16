import React, { Component } from 'react';

export default class App extends Component {
    render() {
        return (
            <div className="text-center">
                <h1>Electron + React hello world</h1>
                <button className="btn btn-primary" onClick={() => alert('Hello')}>
                    HELLO
                </button>
                <h4>Now it works</h4>
            </div>
        );
    }
}
