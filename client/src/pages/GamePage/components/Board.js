/* eslint-disable */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import { pathNames } from 'shared/routes/consts';
import { selectMoves } from 'shared/selectors';
import actions from 'store/actions';

import styles from './Board.scss';

const puzzleSideSize = 4;
const paddedPuzzleSideSize = (puzzleSideSize + 2);
const puzzleSize = (puzzleSideSize ** 2);
const paddedPuzzleSize = (paddedPuzzleSideSize ** 2);

const emptyPaddedConfiguration = _.times(paddedPuzzleSize, () => -1);
const sortedValidConfiguration = _.times(puzzleSize, num => num);
const finalConfiguration = _.times(puzzleSize, num => ((num + 1) % puzzleSize));

const transformToPaddedIndex = index => (
  (paddedPuzzleSideSize + 1) +
  (paddedPuzzleSideSize * Math.floor(index / puzzleSideSize)) +
  (index % puzzleSideSize)
);

const padConfiguration = configuration => {

  if (!configuration) {
    return emptyPaddedConfiguration;
  }

  return _.reduce(configuration, (res, tile, index) => {
    res[transformToPaddedIndex(index)] = tile;
    return res;
  }, [...emptyPaddedConfiguration]);

};

const extendConfiguration = configuration => _.map(configuration, value => ({
  value,
  className: (value === 0 ? styles.empty : ''),
}));

const shrinkConfiguration = configuration => _.map(configuration, 'value');

const Board = ({ initialConfiguration, onSolveCallback }) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const moves = useSelector(selectMoves);

  const isInitialConfigutaionValid = React.useMemo(() => (
    _.isArray(initialConfiguration) &&
    _.chain(initialConfiguration).sortBy().isEqual(sortedValidConfiguration).value()
  ), [initialConfiguration]);

  const extendedInitialConfiguration = React.useMemo(() => extendConfiguration(initialConfiguration), [initialConfiguration]);
  
  const [currentConfiguration, setCurrentConfiguration] = React.useState(extendedInitialConfiguration);
  const [nextConfiguration, setNextConfiguration] = React.useState();
  const paddedConfiguration = React.useMemo(() => padConfiguration(currentConfiguration), [currentConfiguration]);

  const redirectOutIfConfigurationInvalid = React.useCallback(() => {

    if (isInitialConfigutaionValid) {
      return;
    }

    history.push(pathNames.MAIN);
        
  }, [history, isInitialConfigutaionValid]);

  const startGameIfConfigurationValid = React.useCallback(() => {
    
    if (!isInitialConfigutaionValid) {
      return;
    }

    dispatch(actions.setIsGameMode(true));
    
  }, [dispatch, isInitialConfigutaionValid]);

  const onSolve = React.useCallback(() => {

    dispatch(actions.setIsGameMode(false));
    onSolveCallback();

  }, [dispatch, onSolveCallback]);

  const getPaddedTileNeighbors = React.useCallback(tileIndex => {

    const paddedTileIndex = transformToPaddedIndex(tileIndex);
      
    return {
      top: {
        index: (paddedTileIndex - paddedPuzzleSideSize),
        value: paddedConfiguration[(paddedTileIndex - paddedPuzzleSideSize)]?.value,
      },
      right: {
        index: (paddedTileIndex + 1),
        value: paddedConfiguration[(paddedTileIndex + 1)]?.value,
      },
      bottom: {
        index: (paddedTileIndex + paddedPuzzleSideSize),
        value: paddedConfiguration[(paddedTileIndex + paddedPuzzleSideSize)]?.value,
      },
      left: {
        index: (paddedTileIndex - 1),
        value: paddedConfiguration[(paddedTileIndex - 1)]?.value,
      },
    };

  }, [paddedConfiguration]);
  
  const onTileClick = React.useCallback(e => {
    
    const tileValue = Number(e.target.dataset.tileValue);
    const tileIndex = Number(e.target.dataset.tileIndex);

    const isEmptyTile = (tileValue === 0);
    if (isEmptyTile) {
      return;
    }

    const paddedTileNeighbors = getPaddedTileNeighbors(tileIndex);

    const movementDirection = _.findKey(paddedTileNeighbors, ({ value: neighborTileValue }) => (neighborTileValue === 0));
    if (!movementDirection) {
      return;
    }
    
    const newCurrentConfiguration = [...currentConfiguration];
    newCurrentConfiguration[tileIndex] = { value: tileValue, className: styles[movementDirection] };
    setCurrentConfiguration(newCurrentConfiguration);

    const newNextConfiguration = [...currentConfiguration];
    const emptyTileIndex = _.findIndex(currentConfiguration, ({ value }) => (value === 0));
    newNextConfiguration[emptyTileIndex] = { value: tileValue, className: '' };
    newNextConfiguration[tileIndex] = { value: 0, className: styles.empty };
    setNextConfiguration(newNextConfiguration);
    
    dispatch(actions.setMoves(moves + 1));

    const isPuzzleSolved = _.isEqual(shrinkConfiguration(newNextConfiguration), finalConfiguration);
    if (isPuzzleSolved) {
      onSolve();
    }
    
  }, [currentConfiguration, dispatch, getPaddedTileNeighbors, moves, onSolve]);

  React.useEffect(redirectOutIfConfigurationInvalid, [redirectOutIfConfigurationInvalid]);

  React.useEffect(startGameIfConfigurationValid, [startGameIfConfigurationValid]);

  return (
    <div className={styles.board} data-id="board">

      {_.map(currentConfiguration, ({ value: tileValue, className: tileClassName }, index) => (
        <div
          role="none"
          key={_.uniqueId(index)}
          data-tile-index={index}
          data-tile-value={tileValue}
          onClick={onTileClick}
          className={classNames(styles.tile, tileClassName)}
          onAnimationEnd={() => {
            setCurrentConfiguration(nextConfiguration);
          }}
        >
          {tileValue}
        </div>
      ))}

    </div>
  );

};

Board.defaultProps = {
  initialConfiguration: [],
  onSolveCallback() {},
};

Board.propTypes = {
  initialConfiguration: PropTypes.arrayOf(PropTypes.number),
  onSolveCallback: PropTypes.func,
};

export default React.memo(Board);
