import  * as prize  from '../services/prize';

export default {
    namespace: 'prize',

    state: {
        data: [],
        one:{},
        loading: true,
    },

    effects: {
        *now({ payload, callback=function(){}}, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(prize.now, payload);
            yield put({
                type: 'id',
                payload: response,
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            callback();
        },
        *fetch({ payload, callback=function(){}}, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(prize.query, payload);
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
            const response = yield call(prize.add, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback) {
                callback();
            }
        }
    },
    reducers: {
        id(state, action){
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
