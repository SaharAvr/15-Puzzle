import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import AnimatedButton from 'shared/components/AnimatedButton';
import { selectIsGameMode, selectIsPaused, selectMoves, selectTime } from 'shared/selectors';
import timeUtils from 'shared/utils/timeUtils';
import actions from 'store/actions';

import styles from './Stats.scss';

const Stats = ({ className, restartGame }) => {
  
  const dispatch = useDispatch();

  const moves = useSelector(selectMoves);
  const isGameMode = useSelector(selectIsGameMode);
  const isPaused = useSelector(selectIsPaused);

  const timeRef = React.useRef(isGameMode && !isPaused);

  const startTime = React.useMemo(() => Date.now(), []);
  const [pauseClickTime, setPauseClickTime] = React.useState();
  const [totalPauseTimeCount, setTotalPauseTimeCount] = React.useState(0);
  const totalPlayTimeCount = useSelector(selectTime);

  const updateTime = React.useCallback(() => {

    setTimeout(() => {

      if (!timeRef.current) {
        return;
      }
     
      dispatch(actions.setTime((Date.now() - startTime) - totalPauseTimeCount));

    }, 500);

  }, [dispatch, startTime, totalPauseTimeCount]);

  const updateTimeRef = React.useCallback(() => {

    timeRef.current = (isGameMode && !isPaused);

  }, [isGameMode, isPaused]);

  const pauseGame = React.useCallback(() => {

    setPauseClickTime(Date.now());
    dispatch(actions.setIsPaused(true));

  }, [dispatch]);

  const resumeGame = React.useCallback(() => {

    setTotalPauseTimeCount(totalPauseTimeCount + (Date.now() - pauseClickTime));
    dispatch(actions.setIsPaused(false));

  }, [dispatch, pauseClickTime, totalPauseTimeCount]);

  React.useEffect(updateTime, [updateTime, totalPlayTimeCount]);

  React.useEffect(updateTimeRef, [updateTimeRef]);

  return (
    <div className={classNames(styles.stats, className)}>

      <div className={styles.actions}>
        <AnimatedButton
          className={styles.restartButton}
          text="Restart"
          onClick={restartGame}
        />
        <AnimatedButton
          className={classNames({
            [styles.pauseButton]: !isPaused,
            [styles.resumeButton]: isPaused,
          })}
          text={isPaused ? 'Resume' : 'Pause'}
          onClick={isPaused ? resumeGame : pauseGame}
          disabled={!isGameMode}
        />
      </div>

      <span>
        <h4>{timeUtils.formatTime(totalPlayTimeCount)}</h4>
        <h4>{`Moves: ${moves}`}</h4>
      </span>

    </div>
  );

};

Stats.defaultProps = {
  className: '',
  restartGame() {},
};

Stats.propTypes = {
  className: PropTypes.string,
  restartGame: PropTypes.func,
};

export default Stats;
