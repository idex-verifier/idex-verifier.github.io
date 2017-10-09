'use strict';

import {
  createStore,
  combineReducers
} from 'redux';
import throttle from 'lodash/throttle';
import { v1 } from 'uuid';

const saveState = () => {
  try {
    const state = store.getState();
    localStorage.setItem('state', JSON.stringify([
      'tokens',
      'editingToken',
      'newToken'
    ].reduce((r, v) => {
      r[v] = state[v];
      return r;
    }, {})));
  } catch (e) {}
};

const loadState = () => {
  try {
    const persisted = JSON.parse(localStorage.getItem('state'));
    return persisted === null ? undefined : persisted;
  } catch (e) {
    return undefined;
  }
};

const persisted = loadState();

const store = createStore(combineReducers({
  rawData: (state = '', action) => {
    switch (action.type) {
      case 'SET_DATA':
        return action.payload;
    }
    return state;
  },
  result: (state = null, action) => {
    switch (action.type) {
      case 'LOAD_RESULT':
        return action.payload;
      case 'LOAD_ERROR':
        return null;
    }
    return state;
  },
  editingToken: (state = null, action) => {
    switch (action.type) {
      case 'EDIT_TOKEN':
        return Object.assign({}, action.payload);
      case 'UPDATE_TOKEN':
      case 'CANCEL_EDIT_TOKEN':
        return null;
    }
    return state;
  },
  newToken: (state = {}, action) => {
    switch (action.type) {
      case 'EDIT_NEW_TOKEN':
        return Object.assign({}, state, action.payload);
      case 'INSERT_TOKEN':
        return {};
    }
    return state;
  },
  tokens: (state = [], action) => {
    let i;
    switch (action.type) {
      case 'INSERT_TOKEN':
        return [ Object.assign({ uuid: v1() }, action.payload), ...state ];
      case 'DELETE_TOKEN':
        state = state.slice();
        state.splice(state.findIndex((v) => v.uuid === action.payload.uuid), 1);
        return state;
      case 'UPDATE_TOKEN':
        i = state.findIndex((v) => v.uuid === action.payload.uuid);
        return [ ...state.slice(0, i), Object.assign({}, state[i], action.payload, { editing: false }), ...state.slice(i + 1) ];
      case 'EDIT_TOKEN':
        i = state.findIndex((v) => v.uuid === action.payload.uuid);
        return [ ...state.slice(0, i), Object.assign({}, state[i], { editing: true }), ...state.slice(i + 1) ];
      case 'CANCEL_EDIT_TOKEN':
        return state.map((v) => v.editing && Object.assign({}, v, { editing: false }) || v);
    }
    return state;
  },
  error: (state = null, action) => {
    switch (action.type) {
      case 'LOAD_ERROR':
        return action.payload;
      case 'LOAD_RESULT':
        return null;
    }
    return state;
  }
}), persisted);

store.subscribe(throttle(saveState, 2000));

const rawDispatch = store.dispatch;
const listeners = [];
store.dispatch = (evt) => {
  if (process.env.NODE_ENV === 'development') debug(evt);
  const lastState = store.getState();
  rawDispatch(evt);
  const newState = store.getState();
  listeners.forEach(({
    event,
    fn
  }) => event === evt.type && fn(evt, newState, lastState));
};

store.subscribeToEvent = (event, fn) => listeners.push({
  event,
  fn
});

export default store;
