import { stringify } from 'qs';
import request from '../utils/request';
import {DOMAIN} from '../common/constant';

export async function count() {
  return request(DOMAIN+`/admin/brand/count`);
}

export async function query(params) {
  return request(DOMAIN+`/admin/brand/queryList?${stringify(params)}`);
}

export async function add(params) {
    return request(DOMAIN+`/admin/brand/add?${stringify(params)}`);
}

export async function update(params) {
  return request(DOMAIN+`/admin/brand/update`,{method:"POST",body:params});
}

export async function del(params) {
  return request(DOMAIN+`/admin/brand/delById?${stringify(params)}`);
}



