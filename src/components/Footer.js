import React, { Component } from 'react';
import ExternalLink from './base/ExternalLink';
const electron = window.require('electron');

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
                        Node.js: {electron.remote.process.versions.node} - Chrome: {electron.remote.process.versions.chrome} - Electron:{' '}
                        {electron.remote.process.versions.electron} - V8: {electron.remote.process.versions.v8}
                    </p>
                </div>
            </div>
        );
    }
}
