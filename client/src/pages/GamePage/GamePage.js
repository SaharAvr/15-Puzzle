import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Confetti from 'react-confetti';
import classNames from 'classnames';

import AlertDialog from 'shared/components/AlertDialog';
import { pathNames } from 'shared/routes/consts';
import { selectUsername, selectMoves, selectTime, selectIsPaused } from 'shared/selectors';
import restUrls from 'shared/rest/restUrls';
import actions from 'store/actions';

import Stats from './components/Stats';
import Board from './components/Board';
import styles from './GamePage.scss';

const GamePage = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const store = useStore();
  const username = useSelector(selectUsername);
  const isPaused = useSelector(selectIsPaused);

  const [initialConfiguration, setInitialConfiguration] = React.useState();
  const [didSolvePuzzle, setDidSolvePuzzle] = React.useState(false);

  const redirectOutIfUsernameInvalid = React.useCallback(() => {
    
    if (username) {
      return;
    }
    
    history.push(pathNames.MAIN);

  }, [history, username]);

  const loadInitialConfiguration = React.useCallback(async () => {

    const response = await fetch(restUrls.CONFIGURATION, {
      'Content-Type': 'application/json',
    });
    const { data } = await response.json();

    setInitialConfiguration(data);

  }, []);

  const restartGame = React.useCallback(() => {

    dispatch(actions.setIsGameMode(false));
    dispatch(actions.setIsPaused(false));
    dispatch(actions.setMoves(0));
    dispatch(actions.setTime(0));
    setDidSolvePuzzle(false);
    setInitialConfiguration(null);
    loadInitialConfiguration();

  }, [dispatch, loadInitialConfiguration]);

  const onSolveCallback = React.useCallback(async () => {
    
    setDidSolvePuzzle(true);

    const state = store.getState();
    const moves = selectMoves(state);
    const time = selectTime(state);
    
    await fetch(restUrls.RECORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: { username, moves, time },
      }),
    });
    
  }, [store, username]);

  const goToLeaderboardPage = React.useCallback(() => {

    history.push(pathNames.LEADERBOARD);

  }, [history]);

  React.useEffect(redirectOutIfUsernameInvalid, [redirectOutIfUsernameInvalid]);

  React.useEffect(restartGame, [restartGame]);

  return (
    <main
      className={classNames(styles.gamePage, {
        [styles.puzzleSolved]: didSolvePuzzle,
        [styles.gamePaused]: isPaused,
      })}
    >

      <h1>{initialConfiguration ? `Game on, ${username}!` : 'Loading...'}</h1>
      
      {initialConfiguration && (
        <>
          <Stats {...{ className: styles.stats, restartGame }}/>
          <Board {...{ initialConfiguration, onSolveCallback }}/>
        </>
      )}
      
      {didSolvePuzzle && (
        <>
          <Confetti
            gravity={0.4}
            run
            numberOfPieces={400}
          />
          <AlertDialog
            title="Amazing!"
            body="You finally solved it... Much respect"
            confirmButton={{
              text: 'Play again!',
              onClick: restartGame,
            }}
            discardButton={{
              text: 'Go to leaderboard',
              onClick: goToLeaderboardPage,
            }}
            delayMS={2000}
          />
        </>
      )}

    </main>
  );

};

export default GamePage;
