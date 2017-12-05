import { getRecyclesByBrand, addRecyclePhone } from '../services/recycle';

export default {
    namespace: 'recycle',

    state: {
        data: [],
        loading: true,
    },

    effects: {
        *query({ payload }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(getRecyclesByBrand, payload);
            yield put({
                type: 'save',
                payload: response.data,
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
        },
        *add({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(addRecyclePhone, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback();
        }
    },
    reducers: {
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
