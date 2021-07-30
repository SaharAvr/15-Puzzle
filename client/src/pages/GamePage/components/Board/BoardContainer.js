import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';

import { pathNames } from 'shared/routes/consts';
import { selectMoves } from 'shared/selectors';
import actions from 'store/actions';

import useCheats from './useCheats';
import * as boardHelper from './boardHelper';
import BoardView from './BoardView';
import styles from './BoardView.scss';

const Board = ({ initialConfiguration, onSolveCallback }) => {

  const { activeCheat, setActiveCheatData } = useCheats();

  const dispatch = useDispatch();
  const history = useHistory();
  const moves = useSelector(selectMoves);

  const isInitialConfigutaionValid = React.useMemo(() => (
    _.isArray(initialConfiguration) &&
    _.chain(initialConfiguration).sortBy().isEqual(boardHelper.sortedValidConfiguration).value()
  ), [initialConfiguration]);

  const extendedInitialConfiguration = React.useMemo(() => boardHelper.extendConfiguration(initialConfiguration), [initialConfiguration]);
  
  const [currentConfiguration, setCurrentConfiguration] = React.useState(extendedInitialConfiguration);
  const [nextConfiguration, setNextConfiguration] = React.useState([]);

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
  
  const moveTiles = React.useCallback(tileIndex => {

    const emptyTileIndex = _.findIndex(currentConfiguration, ({ value: 0 }));
    const sideAndNeighborIndexes = boardHelper.getSideAndNeighborIndexes({ tileIndex, emptyTileIndex, includeCurrentIndex: true }) || {};
    const canMoveTile = !_.isEmpty(sideAndNeighborIndexes);

    if (!canMoveTile) {
      return;
    }

    const { side, indexes: currentAndNeighborTileIndexes } = sideAndNeighborIndexes;

    const newCurrentConfiguration = (() => {

      const currentConfigurationCopy = [...currentConfiguration];
    
      _.forEach(currentAndNeighborTileIndexes, currentOrNeighborTileIndex => {
        currentConfigurationCopy[currentOrNeighborTileIndex].className = styles[side];
      });

      return currentConfigurationCopy;
      
    })();

    const newNextConfiguration = (() => {
      
      const currentConfigurationCopy = [...currentConfiguration];
      const sizeOfCurrentOrNeighborTileIndexes = _.size(currentAndNeighborTileIndexes);

      _.forEach(currentAndNeighborTileIndexes, (currentOrNeighborTileIndex, index) => {
        
        if (index === 0) {
          currentConfigurationCopy[currentOrNeighborTileIndex] = { value: 0, className: styles.empty };
        }

        if (index < (sizeOfCurrentOrNeighborTileIndexes - 1)) {
          currentConfigurationCopy[currentAndNeighborTileIndexes[index + 1]] = { ...currentConfiguration[currentOrNeighborTileIndex], className: '' };
          return;
        }

        currentConfigurationCopy[emptyTileIndex] = { ...currentConfiguration[currentOrNeighborTileIndex], className: '' };
      
      });

      return currentConfigurationCopy;

    })();

    setCurrentConfiguration(newCurrentConfiguration);
    setNextConfiguration(newNextConfiguration);
    dispatch(actions.setMoves(moves + 1));

    return newNextConfiguration;

  }, [currentConfiguration, dispatch, moves]);

  const swapTiles = React.useCallback((tile1Index, tile2Index) => {

    const newNextConfiguration = [...currentConfiguration];
    newNextConfiguration[tile1Index] = { ...currentConfiguration[tile2Index], className: '' };
    newNextConfiguration[tile2Index] = { ...currentConfiguration[tile1Index], className: '' };
    setNextConfiguration(newNextConfiguration);
    
    dispatch(actions.setMoves(moves + 1));

    return newNextConfiguration;

  }, [currentConfiguration, dispatch, moves]);

  const onTileClick = React.useCallback(e => {
    
    const tileIndex = Number(e.target.dataset.tileIndex);
    const tileValue = Number(e.target.dataset.tileValue);

    const isEmptyTile = (tileValue === 0);
    if (isEmptyTile) {
      return;
    }

    const newNextConfiguration = (() => {

      if (!activeCheat) {
        return moveTiles(tileIndex);
      }

      const { name: activeCheatName, data: activeCheatData } = activeCheat || {};
      
      if (activeCheatName === useCheats.cheats.SWAP) {

        const isReadyToSwap = (!_.isNil(activeCheatData) && (activeCheatData !== tileIndex));
        if (!isReadyToSwap) {
          const newCurrentConfiguration = [...currentConfiguration];
          newCurrentConfiguration[tileIndex].className = styles.selected;
          setCurrentConfiguration(newCurrentConfiguration);
          setActiveCheatData(tileIndex);
          return;
        }

        const otherTileIndex = activeCheatData;
        const configuration = swapTiles(tileIndex, otherTileIndex);
        setActiveCheatData(null);
        setCurrentConfiguration(configuration);
        
        return configuration;

      }

      return currentConfiguration;

    })();

    const isPuzzleSolved = _.isEqual(
      boardHelper.shrinkConfiguration(newNextConfiguration),
      boardHelper.finalConfiguration,
    );

    if (isPuzzleSolved) {
      onSolve();
    }
    
  }, [activeCheat, currentConfiguration, moveTiles, onSolve, setActiveCheatData, swapTiles]);

  React.useEffect(redirectOutIfConfigurationInvalid, [redirectOutIfConfigurationInvalid]);

  React.useEffect(startGameIfConfigurationValid, [startGameIfConfigurationValid]);

  return (
    <BoardView
      {...{
        activeCheat,
        currentConfiguration,
        setCurrentConfiguration,
        nextConfiguration,
        onTileClick,
      }}
    />
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
