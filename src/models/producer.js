import  * as producer  from '../services/producer';

export default {
    namespace: 'producer',

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
            const response = yield call(producer.count, payload);
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
            const response = yield call(producer.query, payload);
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
            const response = yield call(producer.add, payload);
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
            const response = yield call(producer.update, payload);
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
            const response = yield call(producer.del, payload);
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
            const response = yield call(producer.queryById, payload);
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
