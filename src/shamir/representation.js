const Buffer = require('buffer/').Buffer;

const defaultEnvRapp = {
    shardUtil: 'hex',
    textField: 'base64',
    qrCode: 'base64',
    internal: 'buffer',
    password: 'utf8'
};

export const internal_to_textField = rapp => {
    return rapp.toString(defaultEnvRapp.textField);
};

export const textField_to_internal = rapp => {
    return Buffer.from(rapp, defaultEnvRapp.textField);
};

export const internal_to_QRcode = rapp => {
    return rapp.toString(defaultEnvRapp.qrCode);
};

export const QRcode_to_internal = rapp => {
    return Buffer.from(rapp, defaultEnvRapp.qrCode);
};

export const shardUtil_to_internal = rapp => {
    return Buffer.from(rapp, defaultEnvRapp.shardUtil);
};

export const internal_to_shardUtil = rapp => {
    return rapp.toString(defaultEnvRapp.shardUtil);
};

export const password_to_internal = rapp => {
    return Buffer.from(rapp, defaultEnvRapp.password);
};

export const internal_to_password = rapp => {
    return rapp.toString(defaultEnvRapp.password);
};
