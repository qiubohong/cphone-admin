import { stringify } from 'qs';
import request from '../utils/request';
import {DOMAIN} from '../common/constant';

export async function count() {
  return request(DOMAIN+`/admin/maintain/phone/count`);
}

export async function query(params) {
  return request(DOMAIN+`/admin/maintain/phone/queryList?${stringify(params)}`);
}

export async function queryById(params) {
  return request(DOMAIN+`/admin/maintain/phone/queryById?${stringify(params)}`);
}

export async function add(params) {
    return request(DOMAIN+`/admin/maintain/phone/add?${stringify(params)}`);
}

export async function update(params) {
  return request(DOMAIN+`/admin/maintain/phone/update`,{method:"POST",body:params});
}

export async function del(params) {
  return request(DOMAIN+`/admin/maintain/phone/delById?${stringify(params)}`);
}

export async function queryProblem(params) {
  return request(DOMAIN + `/admin/maintain/problem/queryList?${stringify(params)}`);
}

export async function delProblem(params) {
  return request(DOMAIN + `/admin/maintain/problem/delById?${stringify(params)}`);
}

export async function batchAddProblem(urlParam, body){
  return request(DOMAIN + `/admin/maintain/problem/batchAdd?${stringify(urlParam)}`,{method:"POST", body:body});
}

export async function batchUpdateProblem(urlParam, body){
  return request(DOMAIN + `/admin/maintain/problem/batchUpdate?${stringify(urlParam)}`,{method:"POST", body:body});
}



