var base64js = require('base64-js');

export const byteArray_to_hexString = array => {
    return array.reduce(function(a, b) {
        return a.concat(b.toString(16));
    }, '');
};

export const hexString_to_byteArray = strHex => {
    return new Uint8Array(
        strHex.split('').map(function(a, b) {
            return parseInt(a, 16);
        })
    );
};

export const hexString_to_base64 = strHex => {
    // base64js accept a byte array and convert it to a string in base64
    return base64js.fromByteArray(hexString_to_base64(strHex));
};

export const base64_to_hexString = str => {
    // base64js accept a string in base64 and convert it to a byte array
    return byteArray_to_hexString(base64js.toByteArray(str));
};

export const base64_to_byteArray = str => {
    return base64js.toByteArray(str);
};

export const byteArray_to_base64 = str => {
    return base64js.fromByteArray(str);
};
