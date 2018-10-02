import React from 'react';

export default props => {
    let classValue = 'alert alert-' + props.type;
    if (props.dismissable) {
        classValue += ' alert-dismissible fade show';
    }
    return (
        <div className={classValue} role="alert">
            {props.content}
            {props.dismissable ? (
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            ) : (
                ''
            )}
        </div>
    );
};
