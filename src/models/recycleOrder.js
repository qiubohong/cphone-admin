import  * as recycleOrder  from '../services/recycleOrder';

export default {
    namespace: 'recycleOrder',

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
            const response = yield call(recycleOrder.count, payload);
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
            const response = yield call(recycleOrder.query, payload);
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
            const response = yield call(recycleOrder.add, payload);
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
            const response = yield call(recycleOrder.update, payload);
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
            const response = yield call(recycleOrder.del, payload);
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
