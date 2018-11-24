import { cipherFile, decipherFile, hashString } from '../utils/crypto-utils';

const encryptFile = (secret, file) => {
    const secretHash = hashString(secret, 'sha256', { asBuffer: true });
    const path = file.path.split(file.name)[0];
    const nameNoExt = file.name.split('.')[0];
    const destPath = path + nameNoExt + '.enc';
    return cipherFile(file.path, secretHash, destPath);
};

const decryptFile = (secret, file) => {
    const secretHash = hashString(secret, 'sha256', { asBuffer: true });
    return decipherFile(file.path, secretHash);
};

export default {
    encryptFile,
    decryptFile
}