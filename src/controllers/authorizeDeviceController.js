import { generateRandomBytes, hashString, encryptString, decryptString, secret_pbkdf2 } from '../utils/crypto-utils';

const generatePin = () => {
    const secret = generateRandomBytes(256, 'hex');
    const salt = generateRandomBytes(64);
    return secret_pbkdf2(secret, salt, 100, 6, 'sha256');
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