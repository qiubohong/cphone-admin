import { stringify } from 'qs';
import request from '../utils/request';

export async function fakeAccountLogin(params) {
    //模拟登陆
    return new Promise((resolve, reject)=>{
        const { password, userName, type } = params;
        resolve({
          status: password === '123456' && userName === 'admin' ? 'ok' : 'error',
          type,
        });
    });
}