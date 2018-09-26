import secrets from 'secrets.js';
import { shardUtil_to_internal, internal_to_shardUtil } from './representation.js';

export const share = (password, ncreate, nnecessary) => {
    const shares = secrets.share(internal_to_shardUtil(password), ncreate, nnecessary).map(e => '0' + e);
    return shares.map(shardUtil_to_internal);
};

export const random = numb => {
    return shardUtil_to_internal(secrets.random(numb));
};

export const combine = shares => {
    const password = secrets.combine(shares.map(internal_to_shardUtil).map(e => e.slice(1)));
    return shardUtil_to_internal(password);
};
