const app = window.require('electron');
const crypto = app.remote.require('crypto');
const fs = app.remote.require('fs');

const IV_LENGTH = 16; // For AES, this is always 16

export const hashString = (string, algorithm = 'sha256') => {
    const hash = crypto.createHash(algorithm);
    hash.update(string);
    return hash.digest('hex');
};

export const hashFile = (filePath, algorithm = 'sha256') => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        hash.setEncoding('hex');
        const input = fs.createReadStream(filePath);
        input.on('end', () => {
            hash.end();
            resolve(hash.read());
        });

        input.pipe(hash);
    });
};

export const cipherFile = (filePath, secret, algorithm = 'aes256') => {
    return new Promise((resolve, reject) => {
        const iv = crypto.randomBytes(IV_LENGTH);
        // BUG: error on signature, I can't understand what is wrong
        //const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);
        // I can't use initializing vector because of that bug
        const cipher = crypto.createCipher(algorithm, Buffer.from(secret));

        const input = fs.createReadStream(filePath, { encoding: 'utf8' });
        const output = fs.createWriteStream(filePath);

        let encrypted = '';
        /* input.on('data', data => {
            console.log(data);
            encrypted = cipher.update(data.toString(), 'utf8', 'base64');
        }); */
        input.on('end', () => {
           /*  encrypted += cipher.final('base64');
            output.write(encrypted);
            resolve(encrypted); */
            cipher.end();
        });
        cipher.on('data', data => {
            console.log(data.toString());
            if (data) encrypted += data.toString('base64');
            output.write(data.toString('base64'));
        });
        cipher.on('end', () => {
            output.end();
            resolve(encrypted);
        });

        input.pipe(cipher);
    });
};

export const decipherFile = (filePath, secret, algorithm = 'aes256') => {
    return new Promise((resolve, reject) => {
        const decipher = crypto.createDecipher(algorithm, Buffer.from(secret));

        const input = fs.createReadStream(filePath);

        let decrypted = '';
        input.on('data', data => {
            decrypted += decipher.update(data.toString(), 'base64', 'utf8');
            console.log(decrypted);
            // BUG: the event decipher end is never fired to make it works need to do this bad thing
            resolve(decrypted);
        });
        input.on('end', () => {
            decrypted += decipher.final('utf8');
            console.log(decrypted);
            resolve(decrypted);
        });
        /* decipher.on('data', data => {
            if (data) decrypted += data.toString('utf8');
            // BUG: the event decipher end is never fired to make it works need to do this bad thing
            console.log(decrypted);
        });
        decipher.on('end', () => {
            decrypted += decipher.final('utf8');
            resolve(decrypted);
        }) */
    });
};
