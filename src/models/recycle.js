import * as recycle from '../services/recycle';

export default {
    namespace: 'recycle',

    state: {
        data: [],
        one:{},
        loading: true,
    },

    effects: {
        *query({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(recycle.query, payload);
            yield put({
                type: 'save',
                payload: response.data,
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
            if (callback) callback();
        },
        *add({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(recycle.add, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback();
        },
        *update({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(recycle.update, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback();
        },
        *del({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(recycle.del, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback();
        },
        *queryProblem({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(recycle.querytProblem, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback(response);
        },
        *addProblem({ urlParam, bodyParam, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(recycle.addProblem, urlParam, bodyParam);
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback(response);
        },
        *updateProblem({ params1, params2, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response1 = yield call(recycle.updateProblem, params1);
            const response2 = yield call(recycle.updateSelect, params2);
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback();
        },
        *delProblem({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(recycle.delProblem, payload);
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback(response);
        },
        *batchAddProblem({ urlParam, bodyParam, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(recycle.batchAddProblem, urlParam, bodyParam);
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback(response);
        },
        *batchUpdateProblem({ urlParam, bodyParam, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(recycle.batchUpdateProblem, urlParam, bodyParam);
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback(response);
        },
        *queryById({ payload, callback = function(){} }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(recycle.queryById, payload);
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
