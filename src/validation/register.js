const validator = require('validator');
const isEmpty = require('./is-empty');

const validateRegisterInput = data => {
    const errors = {
        username: false,
        password: false,
        password2: false,
        folderInputLabel: false,
        secondFactorFileName: false
    };
    let isValid = true;

    // Check if value is empty (also if not exist) if not set empty string
    // Check only for required fields
    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    data.secondFactorFileName = !isEmpty(data.secondFactorFileName) ? data.secondFactorFileName : '';

    if (!isEmpty(data.password) && !isEmpty(data.password2)) {
        if (data.password !== data.password2) {
            errors.password = 'Passwords does not match';
            errors.password2 = 'Passwords does not match';
            isValid = false;
        }
    }

    if (!validator.isLength(data.password, { min: 8 })) {
        errors.password = 'Password should be at least 8 characters';
        isValid = false;
    }

    if (validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
        isValid = false;
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
        isValid = false;
    }

    if (validator.isEmpty(data.password2)) {
        errors.password2 = 'Confrim Password field is required';
        isValid = false;
    }

    if (validator.isEmpty(data.secondFactorFileName)) {
        errors.secondFactorFileName = 'Second factor file name field is required';
        isValid = false;
    }

    if (data.secondFactorFolder === null) {
        errors.folderInputLabel = 'Second factor file folder is required';
        isValid = false;
    }

    return {
        errors,
        isValid
    };
};

module.exports = {
    validateRegisterInput
};
