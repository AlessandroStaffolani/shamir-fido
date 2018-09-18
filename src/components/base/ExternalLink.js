import React, { Component } from 'react';
const electron = window.require('electron');
const shell = electron.shell;

export default class ExternalLink extends Component {
    handleClick = (event, href) => {
        event.preventDefault();
        shell.openExternal(href);
    };

    render() {
        const { href, title, content } = this.props;
        return (
            <a href={href} title={title} onClick={event => this.handleClick(event, href)}>
                {content}
            </a>
        );
    }
}
