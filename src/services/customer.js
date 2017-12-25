import { stringify } from 'qs';
import request from '../utils/request';
import {DOMAIN} from '../common/constant';

export async function count() {
  return request(DOMAIN+`/admin/customer/count`);
}

export async function query(params) {
  return request(DOMAIN+`/admin/customer/queryList?${stringify(params)}`);
}

export async function queryById(params) {
  return request(DOMAIN+`/admin/customer/queryById?${stringify(params)}`);
}

export async function add(params) {
    return request(DOMAIN+`/admin/customer/add?${stringify(params)}`);
}

export async function update(params) {
  return request(DOMAIN+`/admin/customer/update`,{method:"POST",body:params});
}

export async function del(params) {
  return request(DOMAIN+`/admin/customer/delById?${stringify(params)}`);
}



