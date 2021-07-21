import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertDialog = ({
  title,
  body,
  confirmButton,
  discardButton,
  delayMS,
}) => {

  const showAfterDelay = (_.isNumber(delayMS) && delayMS > 0);
  const [isOpen, setIsOpen] = React.useState(!showAfterDelay);

  const openDialogAfterDelay = React.useCallback(() => {

    if (!showAfterDelay) {
      return;
    }

    setTimeout(() => {
      setIsOpen(true);
    }, delayMS);
    
  }, [delayMS, showAfterDelay]);

  const onConfirm = React.useCallback((...args) => {

    setIsOpen(false);

    if (_.isFunction(confirmButton?.onClick)) {
      confirmButton.onClick(...args);
    }

  }, [confirmButton]);

  const onDiscard = React.useCallback((...args) => {

    setIsOpen(false);

    if (_.isFunction(discardButton?.onClick)) {
      discardButton.onClick(...args);
    }

  }, [discardButton]);

  React.useEffect(openDialogAfterDelay, [openDialogAfterDelay]);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>

      <DialogTitle id="alert-dialog-title">
        {title || ''}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {body || ''}
        </DialogContentText>
      </DialogContent>

      {(confirmButton || discardButton) && (
        <DialogActions>
          {discardButton && (
            <Button onClick={onDiscard} color="primary">
              {discardButton.text || ''}
            </Button>
          )}
          {confirmButton && (
            <Button onClick={onConfirm} color="primary" autoFocus>
              {confirmButton.text || ''}
            </Button>
          )}
        </DialogActions>
      )}
      
    </Dialog>
  );

};

AlertDialog.defaultProps = {
  title: '',
  body: '',
  confirmButton: null,
  discardButton: null,
  delayMS: 0,
};

AlertDialog.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  confirmButton: PropTypes.shape({
    text: PropTypes.string,
    onClick: PropTypes.func,
  }),
  discardButton: PropTypes.shape({
    text: PropTypes.string,
    onClick: PropTypes.func,
  }),
  delayMS: PropTypes.number,
};

export default AlertDialog;
