import { stringify } from 'qs';
import request from '../utils/request';
import {DOMAIN} from '../common/constant';


export async function getBrands() {
  return request(DOMAIN+'/phone/getBrands',{method: "GET"});
}

export async function addPhoneBrand(params) {
    return request(DOMAIN+`/phone/addPhoneBrand?${stringify(params)}`);
}



