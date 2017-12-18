import  * as maintainOrder  from '../services/maintainOrder';

export default {
    namespace: 'maintainOrder',

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
            const response = yield call(maintainOrder.count, payload);
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
            const response = yield call(maintainOrder.query, payload);
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
            const response = yield call(maintainOrder.add, payload);
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
            const response = yield call(maintainOrder.update, payload);
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
            const response = yield call(maintainOrder.del, payload);
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
