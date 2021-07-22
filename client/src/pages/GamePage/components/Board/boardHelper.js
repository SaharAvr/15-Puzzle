import _ from 'lodash';
import styles from './Board.scss';

const puzzleSideSize = 4;
export const paddedPuzzleSideSize = (puzzleSideSize + 2);
const puzzleSize = (puzzleSideSize ** 2);
const paddedPuzzleSize = (paddedPuzzleSideSize ** 2);

const emptyPaddedConfiguration = _.times(paddedPuzzleSize, () => -1);
export const sortedValidConfiguration = _.times(puzzleSize, num => num);
export const finalConfiguration = _.times(puzzleSize, num => ((num + 1) % puzzleSize));

export const transformToPaddedIndex = index => (
  (paddedPuzzleSideSize + 1) +
  (paddedPuzzleSideSize * Math.floor(index / puzzleSideSize)) +
  (index % puzzleSideSize)
);

export const padConfiguration = configuration => {

  if (!configuration) {
    return emptyPaddedConfiguration;
  }

  return _.reduce(configuration, (res, tile, index) => {
    res[transformToPaddedIndex(index)] = tile;
    return res;
  }, [...emptyPaddedConfiguration]);

};

export const extendConfiguration = configuration => _.map(configuration, value => ({
  value,
  className: (value === 0 ? styles.empty : ''),
}));

export const shrinkConfiguration = configuration => _.map(configuration, 'value');
