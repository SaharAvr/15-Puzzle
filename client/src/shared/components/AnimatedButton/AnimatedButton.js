import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './AnimatedButton.scss';

const AnimatedButton = React.forwardRef(({
  className,
  text,
  onClick,
  href,
  disabled,
}, ref) => (
  
  <div
    className={classNames(styles.animatedButton, className, {
      [styles.disabled]: disabled,
    })}
  >
    <div className={styles.animatedButtonInnerWrapper}>
      <div className={styles.animatedButtonBgContainer}/>
      <button>
        <a {...{ href, ref, onClick, role: 'none' }}>
          {text}
        </a>
      </button>
    </div>
  </div>

));

AnimatedButton.defaultProps = {
  className: '',
  text: '',
  onClick() {},
  href: null,
  disabled: false,
};

AnimatedButton.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
  href: PropTypes.string,
  disabled: PropTypes.bool,
};

export default AnimatedButton;
