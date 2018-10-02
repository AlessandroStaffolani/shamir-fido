import { combine, add_prefix_to_shard, newShare } from '../shamir';
import { hashString, hashFile, generateRandomBytes } from '../utils/crypto-utils';
import { internal_to_textField } from '../shamir/representation';
const app = window.require('electron');
const fs = app.remote.require('fs');

const generateMasterSecret = shards => {
    const masterSecret = combine(shards);
    return masterSecret.toString('base64');
};

const createShardsFromString = arrayOfString => {
    const shards = [];
    arrayOfString.map((item, i) => {
        let hash = hashString(item);
        shards.push(add_prefix_to_shard(hash, 8, i + 1));
    });
    return shards;
};

const createSecondFactorKeyFile = (password, destination) => {
    return new Promise((resolve, reject) => {
        let random = generateRandomBytes(256);
        const shards = createShardsFromString([password, random]);
        // Master secret not necessary to be created
        const nextShard = newShare(shards.length + 1, shards);

        fs.writeFile(destination, nextShard.toString('base64'), err => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    shards
                });
            }
        });
    });
};

const masterSecretFromPasswordAndFile = (password, filePath) => {
    return new Promise((resolve, reject) => {
        let passwordHash = hashString(password);
        const shards = [add_prefix_to_shard(passwordHash, 8, 1)];

        fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                let bufferShard = Buffer.from(data, 'base64');
                shards.push(bufferShard.toString());

                const masterSecret = generateMasterSecret(shards);
                resolve(masterSecret);
            }
        });
    });
};

const masterSecretFromLocalStorage = username => {
    let shardsString = localStorage.getItem(username);
    const shards = shardsString.split(',');

    return generateMasterSecret(shards);
};

export default {
    generateMasterSecret,
    createSecondFactorKeyFile,
    masterSecretFromPasswordAndFile,
    masterSecretFromLocalStorage
};
