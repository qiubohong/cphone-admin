import { stringify } from 'qs';
import request from '../utils/request';
const DOMAIN = "http://www.chuangshouji.com";

export async function now() {
  return request(DOMAIN+`/CPhoneRaffle/rafflePrize/getCurPrize`);
}
export async function query() {
  return request(DOMAIN+`/CPhoneRaffle/rafflePrize/getAwardPrizes`);
}

export async function add(params) {
    return request(DOMAIN+`/CPhoneRaffle/rafflePrize/addPrize?${stringify(params)}`,{method:"post"});
}

export async function send(params) {
  return request(DOMAIN+`/CPhoneRaffle/raffle/dispatchRaffle?${stringify(params)}`);
}



