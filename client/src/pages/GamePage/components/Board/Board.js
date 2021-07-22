import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import { pathNames } from 'shared/routes/consts';
import { selectMoves } from 'shared/selectors';
import actions from 'store/actions';

import * as boardHelper from './boardHelper';
import styles from './Board.scss';

const Board = ({ initialConfiguration, onSolveCallback }) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const moves = useSelector(selectMoves);

  const isInitialConfigutaionValid = React.useMemo(() => (
    _.isArray(initialConfiguration) &&
    _.chain(initialConfiguration).sortBy().isEqual(boardHelper.sortedValidConfiguration).value()
  ), [initialConfiguration]);

  const extendedInitialConfiguration = React.useMemo(() => boardHelper.extendConfiguration(initialConfiguration), [initialConfiguration]);
  
  const [currentConfiguration, setCurrentConfiguration] = React.useState(extendedInitialConfiguration);
  const [nextConfiguration, setNextConfiguration] = React.useState();
  const paddedConfiguration = React.useMemo(() => boardHelper.padConfiguration(currentConfiguration), [currentConfiguration]);

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

    const paddedTileIndex = boardHelper.transformToPaddedIndex(tileIndex);
      
    return {
      top: {
        index: (paddedTileIndex - boardHelper.paddedPuzzleSideSize),
        value: paddedConfiguration[(paddedTileIndex - boardHelper.paddedPuzzleSideSize)]?.value,
      },
      right: {
        index: (paddedTileIndex + 1),
        value: paddedConfiguration[(paddedTileIndex + 1)]?.value,
      },
      bottom: {
        index: (paddedTileIndex + boardHelper.paddedPuzzleSideSize),
        value: paddedConfiguration[(paddedTileIndex + boardHelper.paddedPuzzleSideSize)]?.value,
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

    const isPuzzleSolved = _.isEqual(
      boardHelper.shrinkConfiguration(newNextConfiguration),
      boardHelper.finalConfiguration,
    );

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
