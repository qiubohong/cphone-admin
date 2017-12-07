import { stringify } from 'qs';
import request from '../utils/request';
import { DOMAIN } from '../common/constant';

export async function getRecyclesByBrand(brandId) {
    return request(DOMAIN + `/recycle/getRecyclePhones/${brandId}`);
}

export async function addRecyclePhone(params) {
    return request(DOMAIN + `/recycle/addRecyclePhone?${stringify(params)}`);
}

export async function getRecycleProblems(phoneId) {
    return request(DOMAIN + `recycle/getRecycleProblems/${phoneId}`);
}

export async function addHotRecycle2(params) {
    return request(DOMAIN + `/recycle/addHotRecycle?${stringify(params)}`);
}