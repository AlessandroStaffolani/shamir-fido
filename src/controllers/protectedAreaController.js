import { cipherFile, decipherFile } from '../utils/crypto-utils';

const encryptFile = (secret, file) => {
    return cipherFile(file.path, secret);
};

const decryptFile = (secret, file) => {
    return decipherFile(file.path, secret);
};

export default {
    encryptFile,
    decryptFile
}