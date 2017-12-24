import  * as customer  from '../services/prize';

export default {
    namespace: 'prize',

    state: {
        data: [],
        loading: true,
    },

    effects: {
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
