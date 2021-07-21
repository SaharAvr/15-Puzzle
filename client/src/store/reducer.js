import { combineReducers } from 'redux';
import { makeReducer } from 'redux-toolbelt';

import actions from './actions';

export default combineReducers({
  username: makeReducer(actions.setUsername, { defaultState: null }),
  isGameMode: makeReducer(actions.setIsGameMode, { defaultState: false }),
  isPaused: makeReducer(actions.setIsPaused, { defaultState: false }),
  moves: makeReducer(actions.setMoves, { defaultState: 0 }),
  time: makeReducer(actions.setTime, { defaultState: 0 }),
});
