import { stringify } from 'qs';
import request from '../utils/request';
import {DOMAIN} from '../common/constant';

export async function count() {
  return request(DOMAIN+`/admin/maintain/phone/count`);
}

export async function query(params) {
  return request(DOMAIN+`/admin/maintain/phone/queryList?${stringify(params)}`);
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



