import { stringify } from 'qs';
import request from '../utils/request';
import {DOMAIN} from '../common/constant';import  * as maintain  from '../services/maintain';

export default {
    namespace: 'maintain',

    state: {
        data: [],
        one:{},
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
        *query({ payload, callback=function(){}}, { call, put }) {
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
        *queryProblem({ payload, callback = function(){} }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(maintain.queryProblem, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            callback(response);
        },
        *delProblem({ payload, callback = function(){} }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(maintain.delProblem, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            callback(response);
        },
        *batchAddProblem({ urlParam, bodyParam, callback = function(){} }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            console.log(urlParam)
            const response = yield call(maintain.batchAddProblem, urlParam, bodyParam);
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            callback(response);
        },
        *batchUpdateProblem({ urlParam, bodyParam, callback = function(){} }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(maintain.batchUpdateProblem, urlParam, bodyParam);
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            callback(response);
        },
        *queryById({ payload, callback = function(){} }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(maintain.queryById, payload);
            yield put({
                type: 'id',
                payload: response.data,
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            callback(response);
        },
        *delSelect({ payload, callback = function(){} }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(maintain.delSelect, payload);
            yield put({
                type: 'id',
                payload: response.data,
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            callback(response);
        },
    },
    reducers: {
        id(state,action){
            return {
                ...state,
                one: action.payload
            }
        },
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



