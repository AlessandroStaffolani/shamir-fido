import { generateRandomBytes, hashString, encryptString, decryptString } from '../utils/crypto-utils';

const generatePin = () => {
    return generateRandomBytes(6, 'hex');
}

const encryptMessage = (message, secret, isObject = false) => {
    const secretHash = hashString(secret, 'sha256', { asBuffer: true });
    let plainText = message;
    if (isObject) {
        plainText = JSON.stringify(message);
    }
    return encryptString(plainText, secretHash);
}

const decryptMessage = (messageEncrypted , secret, wasObject = false) => {
    const secretHash = hashString(secret, 'sha256', { asBuffer: true });
    let decryptedString = decryptString(messageEncrypted, secretHash);
    if (wasObject) {
        return JSON.parse(decryptedString);
    } 
    return decryptString;
}

export default {
    generatePin,
    encryptMessage,
    decryptMessage
}