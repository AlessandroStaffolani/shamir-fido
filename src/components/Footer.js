import React, { Component } from 'react';
import ExternalLink from './base/ExternalLink';
const app = window.require('electron');

export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="container">
                    <hr />
                    <p className="authors">
                        Alessandro Staffolani |{' '}
                        <ExternalLink
                            href="https://github.com/ale8193"
                            title="Github page"
                            content={
                                <span>
                                    Github <i className="fab fa-github" />
                                </span>
                            }
                        />
                    </p>
                    <p className="versions">
                        Node.js: {app.remote.process.versions.node} - Chrome: {app.remote.process.versions.chrome} - Electron:{' '}
                        {app.remote.process.versions.electron} - V8: {app.remote.process.versions.v8}
                    </p>
                </div>
            </div>
        );
    }
}
