import { makeActionCreator } from 'redux-toolbelt';

export default {
  setUsername: makeActionCreator('setUsername'),
  setIsGameMode: makeActionCreator('setIsGameMode'),
  setIsPaused: makeActionCreator('setIsPaused'),
  setMoves: makeActionCreator('setMoves'),
  setTime: makeActionCreator('setTime'),
};
