import axios from 'axios';

export const ActionType = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  SIGN_OUT: 'SIGN_OUT',
  IN_PROGRESS: 'IN_PROGRESS',
  REQUEST_COMPLETE: 'REQUEST_COMPLETE',
  REQUEST_ERROR: 'REQUEST_ERROR',
  SAVE_DATA: 'SAVE_DATA'
};

const state = {
  token: '',
  inProgress: false,
  userData: {},
  error: false
};

const getters = {
  isAuthenticated: state => !!state.token,
  authInProgress: state => state.inProgress,
  requestErrored: state => state.error,
  email: state => state.userData.email,
  userId: state => state.userData.id
};

const actions = {
  [ActionType.SIGN_IN]: async ({ commit }, user) => {
    commit(ActionType.IN_PROGRESS);
    const result = await axios.post(
      'http://localhost:3000/api/auth/login',
      user
    );
    commit(ActionType.REQUEST_COMPLETE);
    result.data.status == 200
      ? commit(ActionType.SAVE_DATA, result.data.payload)
      : commit(ActionType.REQUEST_ERROR);
  },
  [ActionType.SIGN_UP]: async ({ commit }, user) => {
    commit(ActionType.IN_PROGRESS);
    const result = await axios.post(
      'http://localhost:3000/api/auth/signup',
      user
    );
    commit(ActionType.REQUEST_COMPLETE);
    result.data.status == 201
      ? commit(ActionType.SAVE_DATA, result.data.payload)
      : commit(ActionType.REQUEST_ERROR);
  },
  [ActionType.SIGN_OUT]: async ({ commit }) => {
    commit(ActionType.SIGN_OUT);
  }
};

const mutations = {
  [ActionType.IN_PROGRESS]: state => {
    state.inProgress = true;
    state.error = false;
  },
  [ActionType.SIGN_OUT]: state => {
    state.token = '';
  },
  [ActionType.REQUEST_COMPLETE]: state => {
    state.inProgress = false;
  },
  [ActionType.REQUEST_ERROR]: state => {
    state.error = true;
  },
  [ActionType.SAVE_DATA]: (state, data) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
    state.token = data.token;
    state.userData = data;
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
