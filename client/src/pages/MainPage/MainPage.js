import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import AnimatedButton from 'shared/components/AnimatedButton';
import { pathNames } from 'shared/routes/consts';
import { selectUsername } from 'shared/selectors';
import actions from 'store/actions';

import styles from './MainPage.scss';

const MainPage = () => {

  const dispatch = useDispatch();
  const username = useSelector(selectUsername);

  const inputRef = React.useRef();
  const startButtonLinkRef = React.useRef();
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  
  const isInputValid = username?.length;
  const showInputError = (!isInputValid && !isInputFocused);
  
  const resetUsernameOnLoad = React.useCallback(() => {

    dispatch(actions.setUsername(null));

  }, [dispatch]);

  const focusInputOnLoad = React.useCallback(() => {

    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus();

  }, []);

  const onSubmit = React.useCallback(e => {

    e.preventDefault();
    
    if (!startButtonLinkRef.current) {
      return;
    }

    startButtonLinkRef.current.click();

  }, []);

  React.useEffect(focusInputOnLoad, [focusInputOnLoad]);

  React.useEffect(resetUsernameOnLoad, [resetUsernameOnLoad]);

  return (
    <main className={styles.mainPage}>

      <form onSubmit={onSubmit}>
        
        <h1>15 Puzzle</h1>

        <div
          className={classNames(styles.inputWrapper, {
            withError: showInputError,
          })}
          data-validate="Username is reauired"
        >
          <input
            type="text"
            name="username"
            placeholder="Type your username"
            onChange={e => dispatch(actions.setUsername(e.target.value))}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            ref={inputRef}
          />
          <span data-symbol="&#xf206;"/>
        </div>

        <AnimatedButton
          text="Start Game"
          href={pathNames.GAME}
          ref={startButtonLinkRef}
          disabled={!isInputValid}
        />

      </form>

    </main>
  );

};

export default MainPage;
