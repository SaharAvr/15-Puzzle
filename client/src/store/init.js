import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducer from './reducer';
  
let store;
let persistor;

const persistConfig = {
  key: 'root',
  version: '1',
  storage,
};

const bindMiddlewares = middlewares => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middlewares));
  }
  return applyMiddleware(...middlewares);
};

export default () => {

  if (!store || !persistor) {

    const persistedReducer = persistReducer(persistConfig, reducer);

    store = createStore(persistedReducer, {}, bindMiddlewares([]));
    persistor = persistStore(store);

  }
  
  return { store, persistor };
  
};
