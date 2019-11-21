module.exports = class AppError extends Error {
  constructor(message, options) {
    // Calling parent constructor of base Error class.
    super(message);
    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    let err = this;
    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    options = options || {};
    this.fatal = options.fatal || false;
    this.code = options.code || "UNKNOWN";
    this.level = options.level || "APP";
    this.errorMessage = message;
    this.conn = options.conn || null,
      this.meta = options.meta || {};
    __app.logger.error(this);
    if (options.fatal) {
      if (options.origError)
        __app.logger.error("FATAL ERROR:",options.origError);
      process.kill(process.pid, 'SIGUSR1')
    }
  }
};

module.exports.errorHandler = function (code, msg, newError) {
  var newErr = new Error(msg); // placed here to get correct stack
  return e => {
    console.log(e.stack);
    newErr.originalError = e;
    newErr.code = code;
    throw newErr;
  };
};


module.exports.errorType = function (err) {
  if (err instanceof SyntaxError) return "SyntaxError";
  if (err instanceof TypeError) return "TypeError";
  if (err instanceof EvalError) return "EvalError";
  if (err instanceof RangeError) return "RangeError";
  if (err instanceof ReferenceError) return "ReferenceError";
  return "UNDEF";
}

// Error type in node language
/* 
 console.log("SynstaxError", err instanceof SyntaxError);
        console.log("EvalError", err instanceof EvalError);
        console.log("RangeError", err instanceof RangeError);
        console.log("ReferenceError", err instanceof ReferenceError);
        console.log("TypeError", err instanceof TypeError);

        console.log(err.message); // "null has no properties"
        console.log(err.name); // "TypeError"
        console.log(err.fileName); // "Scratchpad/1"
        console.log(err.lineNumber); // 2
        console.log(err.columnNumber); // 2
        console.log(err.stack); // "@Scratchpad/2:2:3\n"
*/
