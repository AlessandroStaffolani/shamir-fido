const validator = require('validator');
const isEmpty = require('./is-empty');

const validateLoginSecondStepInput = data => {
    const errors = {
        secretFileLabel: false
    };
    let isValid = true;

    if (data.secretFile === null) {
        errors.secretFileLabel = 'You must enter you two factor secret key to login'
        isValid = false;
    }

    return {
        errors,
        isValid
    };
};

module.exports = {
    validateLoginSecondStepInput,
};
