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

const Board = ({ initialConfiguration, onSolveCallback }) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const moves = useSelector(selectMoves);

  const isInitialConfigutaionValid = React.useMemo(() => (
    _.isArray(initialConfiguration) &&
    _.chain(initialConfiguration).sortBy().isEqual(sortedValidConfiguration).value()
  ), [initialConfiguration]);

  const [currentConfiguration, setCurrentConfiguration] = React.useState(initialConfiguration);
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
        tile: paddedConfiguration[(paddedTileIndex - paddedPuzzleSideSize)],
      },
      right: {
        index: (paddedTileIndex + 1),
        tile: paddedConfiguration[(paddedTileIndex + 1)],
      },
      bottom: {
        index: (paddedTileIndex + paddedPuzzleSideSize),
        tile: paddedConfiguration[(paddedTileIndex + paddedPuzzleSideSize)],
      },
      left: {
        index: (paddedTileIndex - 1),
        tile: paddedConfiguration[(paddedTileIndex - 1)],
      },
    };

  }, [paddedConfiguration]);
  
  const onTileClick = React.useCallback(e => {
    
    const tile = Number(e.target.dataset.tile);
    const tileIndex = Number(e.target.dataset.index);

    const isEmptyTile = (tile === 0);
    if (isEmptyTile) {
      return;
    }

    const paddedTileNeighbors = getPaddedTileNeighbors(tileIndex);

    const isEmptyTileNeighbor = _.some(paddedTileNeighbors, ({ tile: neighborTile }) => neighborTile === 0);
    if (!isEmptyTileNeighbor) {
      return;
    }

    const nextConfiguration = [...currentConfiguration];
    const emptyTileIndex = _.findIndex(currentConfiguration, value => (value === 0));

    nextConfiguration[emptyTileIndex] = tile;
    nextConfiguration[tileIndex] = 0;

    setCurrentConfiguration(nextConfiguration);
    dispatch(actions.setMoves(moves + 1));

    const isPuzzleSolved = _.isEqual(nextConfiguration, finalConfiguration);
    if (isPuzzleSolved) {
      onSolve();
    }
    
  }, [currentConfiguration, dispatch, getPaddedTileNeighbors, moves, onSolve]);

  React.useEffect(redirectOutIfConfigurationInvalid, [redirectOutIfConfigurationInvalid]);

  React.useEffect(startGameIfConfigurationValid, [startGameIfConfigurationValid]);

  return (
    <div className={styles.board} data-id="board">

      {_.map(currentConfiguration, (tile, index) => (
        <div
          role="none"
          key={_.uniqueId(index)}
          className={classNames(styles.tile, {
            [styles.empty]: (tile === 0),
          })}
          data-index={index}
          data-tile={tile}
          onClick={onTileClick}
        >
          {tile}
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
