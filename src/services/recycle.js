import { stringify } from 'qs';
import request from '../utils/request';
import { DOMAIN } from '../common/constant';

export async function count() {
    return request(DOMAIN + `/admin/recycle/phone/count`);
}

export async function query(params) {
    return request(DOMAIN + `/admin/recycle/phone/queryList?${stringify(params)}`);
}

export async function add(params) {
    return request(DOMAIN + `/admin/recycle/phone/add?${stringify(params)}`);
}

export async function update(params) {
    return request(DOMAIN + `/admin/recycle/phone/update`, {method:"POST", body:params});
}

export async function del(params) {
    return request(DOMAIN + `/admin/recycle/phone/delById?${stringify(params)}`);
}

export async function batchAddProblem(urlParam, body){
    return request(DOMAIN + `/admin/recycle/problem/batchAdd?${stringify(urlParam)}`,{method:"POST", body:body});
}

export async function batchUpdateProblem(urlParam, body){
    return request(DOMAIN + `/admin/recycle/problem/batchUpdate?${stringify(urlParam)}`,{method:"POST", body:body});
}

export async function querytProblem(params) {
    return request(DOMAIN + `/admin/recycle/problem/queryList?${stringify(params)}`);
}

export async function addProblem(params1, params2) {
    return request(DOMAIN + `/admin/recycle/problem/add?${stringify(params1)}`,{method:"POST", body:params2});
}

export async function updateProblem(params) {
    return request(DOMAIN + `/admin/recycle/problem/update?${stringify(params)}`);
}

export async function delProblem(params) {
    return request(DOMAIN + `/admin/recycle/problem/delById?${stringify(params)}`);
}

export async function updateSelect(params) {
    console.log(params)
    return request(DOMAIN + `/admin/recycle/select/update`,{method:"POST", body:params});
}


