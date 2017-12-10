import { stringify } from 'qs';
import request from '../utils/request';
import {DOMAIN} from '../common/constant';import  * as maintain  from '../services/maintain';

export default {
    namespace: 'maintain',

    state: {
        data: [],
        count: 0,
        loading: true,
    },

    effects: {
        *count({payload}, {call,put}){
            yield put({
                type:"changeLoading",
                payload: true
            })
            const response = yield call(maintain.count, payload);
            yield put({
                type: 'saveCount',
                payload: response.data,
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });

        },
        *fetch({ payload, callback=function(){}}, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(maintain.query, payload);
            yield put({
                type: 'save',
                payload: response.data,
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            callback();
        },
        *add({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(maintain.add, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback) {
                callback();
            }
        },
        *update({ payload, callback = function(){} }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(maintain.update, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            callback(response);
        },
        *del({ payload, callback = function(){} }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(maintain.del, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            callback(response);
        },
    },
    reducers: {
        saveCount(state, action){
            return {
                ...state,
                count: action.payload
            }
        },
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
    },
};


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


