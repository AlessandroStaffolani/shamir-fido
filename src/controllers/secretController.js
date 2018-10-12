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
        let randomShardBuffer = Buffer.from(shards[1]);

        saveShardOnFile(randomShardBuffer, destination)
            .then(() => {
                resolve(shards);
            })
            .catch(err => reject(err));
    });
};

/**
 * Create a file with a base64 version of a shard
 * @param {Buffer} shard shard as a Buffer
 * @param {String} destination destination path of the file
 */
const saveShardOnFile = (shard, destination) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(destination, shard.toString('base64'), err => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    shard
                });
            }
        });
    });
}

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
                resolve({
                    masterSecret,
                    shards
                });
            }
        });
    });
};

const getShardsFromLocalStorage = username => {
    let shardsString = localStorage.getItem(username);
    if (shardsString !== null) {
        const shards = shardsString.split(',');
        return shards;
    } else {
        null;
    }
};

const masterSecretFromLocalStorage = username => {
    const shards = getShardsFromLocalStorage(username);
    if (shards !== null) {
        return generateMasterSecret(shards);
    } else {
        null;
    }
};

const generateNextShard = username => {
    const shards = getShardsFromLocalStorage(username);
    if (shards !== null) {
        const nextShard = newShare(3, shards);
        return nextShard.toString('base64');
    }
};

export default {
    generateMasterSecret,
    createShardsFromString,
    createSecondFactorKeyFile,
    masterSecretFromPasswordAndFile,
    masterSecretFromLocalStorage,
    saveShardOnFile,
    generateNextShard,
};
