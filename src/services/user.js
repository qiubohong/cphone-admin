import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return new Promise((resolve, reject)=>{
    let user = {};
    try{
      user = JSON.parse(localStorage.getItem('user'));
    }catch(e){
      console.log(e);
    }
    resolve({
      ...user
    });
});
}
