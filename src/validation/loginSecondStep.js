const validator = require('validator');
const isEmpty = require('./is-empty');

const validateLoginSecondStepInput = data => {
    const errors = {
        device: false,
        pin: false,
        secretFile: false
    };
    let isValid = true;

    if (!isEmpty(data.device)) {
        if (!validator.isIP(data.device)) {
            errors.device = 'Device ip is not correct';
            isValid = false;
        }

        if (isEmpty(data.pin)) {
            errors.pin = 'If you are using device method pin field is required';
            isValid = false;
        }
    } else if (validator.equals(data.secretFileLabel, 'Choose your secret file')) {
        errors.device = 'One between device and secret file is required';
        errors.secretFileLabel = 'One between device and secret file is required';
        isValid = false;
    }

    return {
        errors,
        isValid
    };
};

const isValidIp = value => {
    return validator.isIP(value);
};

module.exports = {
    validateLoginSecondStepInput,
    isValidIp
};
