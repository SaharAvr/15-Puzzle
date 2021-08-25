const severityTypes = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
};

class LoggerService {

  constructor() {
    this.isOn = false;
    this.severity = severityTypes;
  }

  init() {
    this.isOn = true;
  }

  logToConsole(severity, ...rest) {

    if (!this.isOn) {
      return;
    }
    
    if (!window.console) {
      return;
    }

    window.console[severity](...rest);

  }

  error(...rest) {
    this.logToConsole(this.severity.ERROR, ...rest);
  }

  warn(...rest) {
    this.logToConsole(this.severity.WARN, ...rest);
  }

  info(...rest) {
    this.logToConsole(this.severity.INFO, ...rest);
  }

}

export default new LoggerService();
