import { stringify } from 'qs';
import request from '../utils/request';
import { DOMAIN } from '../common/constant';

export async function count() {
    return request(DOMAIN + `/admin/recycle/phone/queryList`);
}

export async function query(params) {
    return request(DOMAIN + `/admin/recycle/phone/queryList?${stringify(params)}`);
}

export async function add(params) {
    return request(DOMAIN + `/admin/recycle/phone/add?${stringify(params)}`);
}

export async function update(phoneId) {
    return request(DOMAIN + `recycle/getRecycleProblems/${phoneId}`);
}

export async function addHotRecycle2(params) {
    return request(DOMAIN + `/recycle/addHotRecycle?${stringify(params)}`);
}