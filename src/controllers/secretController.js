import { combine, add_prefix_to_shard } from '../shamir';
import { hashString, hashFile } from '../utils/crypto-utils';
import { internal_to_textField } from '../shamir/representation';

/**
 * 
 * @param {Object} formData The registration data and it contain these fields:
 *  formData = {
 *      password: string,
 *      pin: string, [optional]
 *      secretFile: File, [optional]
 * }
 * @returns {Promise} The promise if nothing is wrong return this object: 
 *  result = {
 *      masterSecret: string,  // The generated master secret
 *      shares: Array          // Array of shares used to create the secret
 * }
 */
const generateMasterSecret = formData => {
    return new Promise((resolve, reject) => {
        const shards = [hashString(formData.password)];
        if (formData.pin) {
            shards.push(hashString(formData.pin));
        }
        let fileHashPromise = null;
        if (formData.secretFile) {
            fileHashPromise = hashFile(formData.secretFile.path)
                .then(digest => {
                    shards.push(digest);
                    return shards;
                })
                .catch(err => reject(err));
        }

        if (fileHashPromise) {
            fileHashPromise
                .then(shards => {
                    let bufferShards = shards.map((shard, i) => add_prefix_to_shard(shard, 8, i + 1));
                    //bufferShards = shards.map(textField_to_internal);
                    const masterSecret = combine(bufferShards);
                    resolve({
                        masterSecret: internal_to_textField(masterSecret),
                        shares: bufferShards
                    });
                })
                .catch(err => reject(err));
        } else {
            let bufferShards = shards.map((shard, i) => add_prefix_to_shard(shard, 8, i + 1));
            //bufferShards = shards.map(textField_to_internal);
            const masterSecret = combine(bufferShards);
            resolve({
                masterSecret: internal_to_textField(masterSecret),
                shares: bufferShards
            });
        }
    });
};



export default {
    generateMasterSecret
};