import config from '../config';
import { combine } from '../shamir';
import { hashString, hashFile } from '../utils/crypto-utils';
import { textField_to_internal, internal_to_password, internal_to_textField } from '../shamir/representation';

const init = () => {
    return {};
};

const initForm = () => {
    return {
        form: {
            password: '',
            device: '',
            pin: '',
            secretFileLabel: 'Choose your secret file',
            numShards: config.shardOptions.defaultMinShards.toString()
        },
        secretFile: null,
        pinDisabled: true,
        errors: {
            password: false,
            device: false,
            pin: false,
            secretFileLabel: false,
            numShards: false
        }
    };
};

/**
 *
 * @param {Object} formData The registration data and it contain these fields:
 *  formData = {
 *      password: string,
 *      pin: string, [optional]
 *      secretFile: File, [optional]
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
            fileHashPromise = hashFile(formData.secretFile.path).then(digest => {
                shards.push(digest);
                return shards;
            })
                .catch(err => reject(err));
        }

        if (fileHashPromise) {
            fileHashPromise
            .then(shards => {
                console.log(shards);
                let bufferShards = shards.map(textField_to_internal);
                console.log(bufferShards);
                const masterSecret = combine(bufferShards);
                resolve(masterSecret);
                console.log(masterSecret, internal_to_textField(masterSecret));
            })
            .catch(err => reject(err));
        } else {
            console.log(shards);
            let bufferShards = shards.map(textField_to_internal);
            console.log(bufferShards);
            const masterSecret = combine(bufferShards);
            resolve(masterSecret);
        } 
    });
};

export default {
    init,
    initForm,
    generateMasterSecret
};
