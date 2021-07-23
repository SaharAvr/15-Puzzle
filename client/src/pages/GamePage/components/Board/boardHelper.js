import _ from 'lodash';
import styles from './Board.scss';

const puzzleSideSize = 4;
export const paddedPuzzleSideSize = (puzzleSideSize + 2);
const puzzleSize = (puzzleSideSize ** 2);
const paddedPuzzleSize = (paddedPuzzleSideSize ** 2);

const emptyPaddedConfiguration = _.times(paddedPuzzleSize, () => -1);
export const sortedValidConfiguration = _.times(puzzleSize, num => num);
export const finalConfiguration = _.times(puzzleSize, num => ((num + 1) % puzzleSize));

export const sides = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
};

export const transformToPaddedIndex = index => {
  
  const paddedRow = (Math.floor(index / puzzleSideSize) + 1);
  const paddedColumn = ((index % puzzleSideSize) + 1);

  return ((paddedRow * paddedPuzzleSideSize) + paddedColumn);

};

const transformToNormalIndex = paddedIndex => {

  const normalRow = (Math.floor(paddedIndex / paddedPuzzleSideSize) - 1);
  const normalColumn = ((paddedIndex % paddedPuzzleSideSize) - 1);

  return ((normalRow * puzzleSideSize) + normalColumn);

};

export const padConfiguration = configuration => {

  if (!configuration) {
    return emptyPaddedConfiguration;
  }

  return _.reduce(configuration, (res, tile, index) => {
    res[transformToPaddedIndex(index)] = tile;
    return res;
  }, [...emptyPaddedConfiguration]);

};

export const getSideAndNeighborIndexes = ({ tileIndex, emptyTileIndex, includeCurrentIndex }) => {

  const paddedTileIndex = transformToPaddedIndex(tileIndex);
  const paddedEmptyTileIndex = transformToPaddedIndex(emptyTileIndex);
  
  const numberOfIndexesFromTop = Math.floor((paddedTileIndex - paddedPuzzleSideSize) / paddedPuzzleSideSize);
  const numberOfIndexesFromRight = (((paddedPuzzleSideSize - 1) - 1) - (paddedTileIndex % paddedPuzzleSideSize));
  const numberOfIndexesFromBottom = Math.floor(((paddedPuzzleSize - paddedPuzzleSideSize) - paddedTileIndex) / paddedPuzzleSideSize);
  const numberOfIndexesFromLeft = ((paddedTileIndex % paddedPuzzleSideSize) - 1);
  
  const side = (() => {

    if (paddedEmptyTileIndex < paddedTileIndex) {

      if (paddedEmptyTileIndex < (paddedTileIndex - numberOfIndexesFromLeft)) {
        return sides.TOP;
      }

      return sides.LEFT;

    }

    if (paddedEmptyTileIndex > paddedTileIndex) {

      if (paddedEmptyTileIndex > (paddedTileIndex + numberOfIndexesFromRight)) {
        return sides.BOTTOM;
      }

      return sides.RIGHT;

    }

  })();
  
  let indexes;
  let didReachEmptyIndex = false;

  if (side === sides.TOP) {

    indexes = _.chain(numberOfIndexesFromTop).times(index => {
      
      if (didReachEmptyIndex) {
        return;
      }

      const nextIndex = transformToNormalIndex(paddedTileIndex - (paddedPuzzleSideSize * (index + 1)));

      if (nextIndex === emptyTileIndex) {
        didReachEmptyIndex = true;
        return;
      }

      return nextIndex;

    }).compact().value();

  }

  if (side === sides.RIGHT) {

    indexes = _.chain(numberOfIndexesFromRight).times(index => {

      if (didReachEmptyIndex) {
        return;
      }

      const nextIndex = transformToNormalIndex(paddedTileIndex + (index + 1));

      if (nextIndex === emptyTileIndex) {
        didReachEmptyIndex = true;
        return;
      }

      return nextIndex;

    }).compact().value();

  }

  if (side === sides.BOTTOM) {

    indexes = _.chain(numberOfIndexesFromBottom).times(index => {

      if (didReachEmptyIndex) {
        return;
      }

      const nextIndex = transformToNormalIndex(paddedTileIndex + (paddedPuzzleSideSize * (index + 1)));

      if (nextIndex === emptyTileIndex) {
        didReachEmptyIndex = true;
        return;
      }

      return nextIndex;

    }).compact().value();

  }

  if (side === sides.LEFT) {

    indexes = _.chain(numberOfIndexesFromLeft).times(index => {

      if (didReachEmptyIndex) {
        return;
      }

      const nextIndex = transformToNormalIndex(paddedTileIndex - (index + 1));

      if (nextIndex === emptyTileIndex) {
        didReachEmptyIndex = true;
        return;
      }

      return nextIndex;

    }).compact().value();

  }

  if (!didReachEmptyIndex) {
    return;
  }
  
  if (includeCurrentIndex) {
    indexes.unshift(tileIndex);
  }

  return { side, indexes };

};

export const extendConfiguration = configuration => _.map(configuration, value => ({
  value,
  className: (value === 0 ? styles.empty : ''),
}));

export const shrinkConfiguration = configuration => _.map(configuration, 'value');
