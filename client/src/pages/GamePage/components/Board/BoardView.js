import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import styles from './BoardView.scss';

const BoardView = ({
  activeCheat,
  currentConfiguration,
  setCurrentConfiguration,
  nextConfiguration,
  onTileClick,
}) => (

  <div className={styles.board} data-id="board">

    {_.map(currentConfiguration, ({ value: tileValue, className: tileClassName }, index) => (
      <div
        role="none"
        key={_.uniqueId(index)}
        data-tile-index={index}
        data-tile-value={tileValue}
        onClick={onTileClick}
        className={classNames(styles.tile, tileClassName, {
          [styles.withCheats]: !_.isEmpty(activeCheat),
          [styles[activeCheat.name]]: activeCheat.name,
        })}
        onAnimationEnd={() => {
          setCurrentConfiguration(nextConfiguration);
        }}
      >
        {tileValue}
      </div>
    ))}

  </div>

);

BoardView.defaultProps = {
  activeCheat: {},
};

BoardView.propTypes = {
  activeCheat: PropTypes.shape({
    name: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.any,
  }),
  currentConfiguration: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      className: PropTypes.string,
    }),
  ).isRequired,
  setCurrentConfiguration: PropTypes.func.isRequired,
  nextConfiguration: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      className: PropTypes.string,
    }),
  ).isRequired,
  onTileClick: PropTypes.func.isRequired,
};

export default BoardView;
