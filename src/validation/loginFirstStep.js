const validator = require('validator');
const isEmpty = require('./is-empty');

const validateLoginFirstStepInput = data => {
    const errors = {
        password: false
    };
    let isValid = true;

    // Check if value is empty (also if not exist) if not set empty string
    // Check only for required fields
    data.password = !isEmpty(data.password) ? data.password : '';

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
        isValid = false;
    }

    return {
        errors,
        isValid
    };
};

module.exports = {
    validateLoginFirstStepInput
};
