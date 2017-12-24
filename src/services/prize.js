import { stringify } from 'qs';
import request from '../utils/request';
const DOMAIN = "http://www.chuangshouji.com";


export async function query() {
  return request(DOMAIN+`/CPhoneRaffle/rafflePrize/getAwardPrizes`);
}

export async function add(params) {
    return request(DOMAIN+`/CPhoneRaffle/rafflePrize/addPrize?${stringify(params)}`);
}



