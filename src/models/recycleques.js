import { hotRecycles, addHotRecycle } from '../services/recycle';

export default {
    namespace: 'recycleques',

    state: {
        data: [],
        loading: true,
    },

    effects: {
        *hot({ payload }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(hotRecycles, payload);
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
            const response = yield call(addHotRecycle, payload);
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
