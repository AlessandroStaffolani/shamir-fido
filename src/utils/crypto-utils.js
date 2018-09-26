const app = window.require('electron');
const crypto = app.remote.require('crypto');
const fs = app.remote.require('fs');

export const hashString = (string, algorithm = 'sha256') => {
    const hash = crypto.createHash(algorithm);
    hash.update(string);
    return hash.digest('hex');
};

export const hashFile = (filename, algorithm = 'sha256') => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        hash.setEncoding('hex');
        const input = fs.createReadStream(filename);
        input.on('end', () => {
            hash.end();
            resolve(hash.read());
        });

        input.pipe(hash);
    });
};
