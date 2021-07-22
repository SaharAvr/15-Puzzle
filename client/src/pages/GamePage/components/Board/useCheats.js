import React from 'react';
import _ from 'lodash';

const cheats = {
  SWAP: 'swap',
};

const maxCheatStringLength = _.chain(cheats)
  .values()
  .map(cheat => _.size(cheat))
  .max()
  .value();

const clearanceTimeoutDelay = 3000;

const useCheats = () => {

  const [activeCheat, setActiveCheat] = React.useState();
  const [cheatString, setCheatString] = React.useState('');
  const cheatStringRef = React.useRef(cheatString);
  const clearanceTimeoutRef = React.useRef();

  const listenToKeyPresses = React.useCallback(() => {

    const keydownListener = document.addEventListener('keydown', ({ key }) => {
      
      const appendedString = `${cheatStringRef.current}${_.toLower(key)}`;
      const newCheatString = appendedString.substring(_.size(appendedString) - maxCheatStringLength);
  
      setCheatString(newCheatString);
      cheatStringRef.current = newCheatString;
  
    });

    return () => document.removeEventListener('keydown', keydownListener);

  }, []);

  const listenToCheatStrings = React.useCallback(() => {

    if (activeCheat) {

      const didTurnCheatOff = (new RegExp(`.*${activeCheat.name}.*`, 'i')).test(cheatString);

      if (!didTurnCheatOff) {
        return;
      }

      // eslint-disable-next-line no-console
      console.log('[CHEAT MODE OFF]');
      setActiveCheat(null);
      setCheatString('');

      return;

    }

    if (!cheatString) {
      return;
    }

    const activatedCheat = _.find(cheats, value => {
      return (new RegExp(`.*${value}.*`)).test(cheatString);
    });

    if (!activatedCheat) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log(`CHEATER... ==> ${_.toUpper(activatedCheat)}`);
    setActiveCheat({ name: activatedCheat, data: null });
    setCheatString('');

  }, [activeCheat, cheatString]);

  const setActiveCheatData = React.useCallback(newData => {
    setActiveCheat({ ...activeCheat, data: newData });
  }, [activeCheat]);

  const clearCheatStringOnTimeout = React.useCallback(() => {

    if (!cheatString) {
      return;
    }

    if (clearanceTimeoutRef.current) {
      clearTimeout(clearanceTimeoutRef.current);
      clearanceTimeoutRef.current = null;
    }

    clearanceTimeoutRef.current = setTimeout(() => {
      setCheatString('');
      cheatStringRef.current = '';
    }, clearanceTimeoutDelay);

  }, [cheatString]);

  React.useEffect(listenToKeyPresses, [listenToKeyPresses]);

  React.useEffect(listenToCheatStrings, [listenToCheatStrings]);

  React.useEffect(clearCheatStringOnTimeout, [clearCheatStringOnTimeout]);

  return {
    activeCheat,
    setActiveCheatData,
  };

};

useCheats.cheats = cheats;

export default useCheats;
