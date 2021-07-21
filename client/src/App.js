import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { PersistGate } from 'redux-persist/integration/react';

import MainPage from 'pages/MainPage';
import GamePage from 'pages/GamePage';
import LeaderboardPage from 'pages/LeaderboardPage';
import { pathNames } from 'shared/routes/consts';

import initStore from './store/init';

const { store, persistor } = initStore();

const App = () => (
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Switch>
          <Route path={pathNames.MAIN} exact component={MainPage}/>
          <Route path={pathNames.GAME} exact component={GamePage}/>
          <Route path={pathNames.LEADERBOARD} exact component={LeaderboardPage}/>
          <Redirect to={pathNames.MAIN}/>
        </Switch>
      </Router>
    </PersistGate>
  </ReduxProvider>
);

export default hot(App);
