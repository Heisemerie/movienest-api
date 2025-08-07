// factory function that maps the handler into an async function which wraps the handler in a try-catch block
function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      // Log the error
      next(error);
    }
  };
}

module.exports = asyncMiddleware;
