import secrets from 'secrets.js-grempe';
import { shardUtil_to_internal, internal_to_shardUtil } from './representation.js';

export const share = (password, ncreate, nnecessary) => {
    const shares = secrets.share(internal_to_shardUtil(password), ncreate, nnecessary).map(e => '0' + e);
    return shares//.map(shardUtil_to_internal);
};

export const random = numb => {
    return shardUtil_to_internal(secrets.random(numb));
};

export const combine = shares => {
    const password = secrets.combine(shares);
    //const password = secrets.combine(shares.map(internal_to_shardUtil).map(e => e.slice(1)));
    return shardUtil_to_internal(password);
};

export const newShare = (id, shares) => {
    const newShare = secrets.newShare(id, shares);
    return newShare;
};

export const add_prefix_to_shard = (shard, bitsValue, id) => {
    let bits = parseInt(bitsValue, 36);
    let idLenght = (Math.pow(2, bits) - 1).toString(16).length;
    let idString = id.toString(16);
    let difference = idLenght - idString.length;
    if (difference > 0) {
        for (let i = 0; i < difference; i++) {
            idString = '0' + idString;
        }
    }
    let newShard = bits.toString(16) + idString + shard;
    return newShard;
};