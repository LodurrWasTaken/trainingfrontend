import axios from 'axios';

export const ActionType = {
  FETCH_SESSIONS_BANK: 'FETCH_SESSIONS_BANK',
  SAVE_SESSIONS_BANK: 'SAVE_SESSIONS_BANK',
  SAVE_SESSIONS_PLAN: 'SAVE_SESSIONS_PLAN',
  CREATE_PLAN: 'CREATE_PLAN',
  CREATE_PLAN_SUCCESS: 'CREATE_PLAN_SUCCESS',
  CREATE_SESSION: 'CREATE_SESSION',
  CREATE_SESSION_SUCCESS: 'CREATE_SESSION_SUCCESS',
  SAVE_PLAN_ID: 'SAVE_PLAN_ID',
  CLEAR_SESSIONS: 'CLEAR_SESSIONS',
  DELETE_SESSION: 'DELETE_SESSION',
  CHECK_SESSION: 'CHECK_SESSION',
  DELETE_SESSION_FROM_BANK: 'DELETE_SESSION_FROM_BANK',
  RESET_STATE: 'RESET_STATE'
};

const state = {
  sessionsBank: [],
  plan: null,
  planId: null
};

const getters = {
  sessionsBank: state => state.sessionsBank,
  plan: state => state.plan
};

const actions = {
  [ActionType.FETCH_SESSIONS_BANK]: async ({ commit }, user) => {
    const result = await axios.get('http://localhost:3000/api/sessions');
    commit(ActionType.SAVE_SESSIONS_BANK, result.data.payload);
  },
  [ActionType.CREATE_PLAN]: async ({ commit }, userId) => {
    const result = await axios.post('http://localhost:3000/api/plans', {
      userId
    });
    commit(ActionType.CREATE_PLAN_SUCCESS, result.data.payload.id);
  },
  [ActionType.CREATE_SESSION]: async ({ commit }, data) => {
    const result = await axios.post('http://localhost:3000/api/sessions', data);
    commit(ActionType.CREATE_SESSION_SUCCESS, result.data.payload);
  },
  [ActionType.CHECK_SESSION]: async ({ commit, state }, { id, status }) => {
    await axios.patch(`http://localhost:3000/api/sessions/${id}/check`, {
      status
    });
    const newPlan = state.plan.map(s => {
      if (s.id === id) s.completed = status;
      return s;
    });
    commit(ActionType.SAVE_SESSIONS_PLAN, newPlan);
  },
  [ActionType.SAVE_SESSIONS_PLAN]: async ({ commit, state }, sessions) => {
    sessions = sessions.map((d, i) => {
      d.plan_id = state.planId;
      d.order = i;
      return d;
    });
    await axios.put('http://localhost:3000/api/sessions', sessions);
    commit(ActionType.SAVE_SESSIONS_PLAN, sessions);
  },
  [ActionType.CLEAR_SESSIONS]: async ({ commit, state }, sessions) => {
    sessions = state.plan.map(d => {
      d.plan_id = null;
      d.completed = false;
      return d;
    });
    await axios.put('http://localhost:3000/api/sessions', sessions);
    const result = await axios.get('http://localhost:3000/api/sessions');
    commit(ActionType.SAVE_SESSIONS_PLAN, []);
    commit(ActionType.SAVE_SESSIONS_BANK, result.data.payload);
  },
  [ActionType.DELETE_SESSION]: async ({ commit, state }, id) => {
    const sessions = state.plan.map((d, i) => {
      if (d.id === id) {
        d.plan_id = null;
        d.completed = false;
      }
      return d;
    });
    const newPlan = sessions.filter(s => s.id !== id);
    await axios.put('http://localhost:3000/api/sessions', sessions);
    const result = await axios.get('http://localhost:3000/api/sessions');
    commit(ActionType.SAVE_SESSIONS_BANK, result.data.payload);
    commit(ActionType.SAVE_SESSIONS_PLAN, newPlan);
  },
  [ActionType.DELETE_SESSION_FROM_BANK]: async ({ commit, state }, id) => {
    await axios.delete(`http://localhost:3000/api/sessions/${id}`);
  }
};

const mutations = {
  [ActionType.SAVE_SESSIONS_BANK]: (state, sessions) => {
    state.sessionsBank = sessions;
  },
  [ActionType.SAVE_SESSIONS_PLAN]: (state, plan) => {
    state.plan = plan;
  },
  [ActionType.SAVE_PLAN_ID]: (state, planId) => {
    state.planId = planId;
  },
  [ActionType.CREATE_PLAN_SUCCESS]: (state, planId) => {
    state.plan = [];
    state.planId = planId;
  },
  [ActionType.CREATE_SESSION_SUCCESS]: (state, session) => {
    state.sessionsBank.push(session);
  },
  [ActionType.RESET_STATE]: state => {
    state.sessionsBank = [];
    state.plan = null;
    state.planId = null;
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
