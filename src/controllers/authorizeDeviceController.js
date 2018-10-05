import { generateRandomBytes, hashString, encryptString, decryptString } from '../utils/crypto-utils';

const generatePin = () => {
    return generateRandomBytes(6, 'hex');
}

const encryptMessage = (message, secret) => {
    const secretHash = hashString(secret, 'sha256', { asBuffer: true });
    return encryptString(message, secretHash);
}

const decryptMessage = (messageEncrypted , secret) => {
    const secretHash = hashString(secret, 'sha256', { asBuffer: true });
    return decryptString(messageEncrypted, secretHash)
}

export default {
    generatePin,
    encryptMessage,
    decryptMessage
}