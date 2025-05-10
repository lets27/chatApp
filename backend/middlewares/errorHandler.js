const errMiddleware = (error, req, res, next) => {
  if (res.headersSent) {
    // If headers are already sent, delegate to the default Express error handler
    return next(error);
  }

  let errCopy = { ...error };

  // Mongoose Bad ObjectId
  if (error.name === "CastError") {
    errCopy = new Error("Resource not found");
    errCopy.status = 400;
  }

  // Mongoose Duplicate Keys
  if (error.code === 11000) {
    errCopy = new Error("Duplicate field value entered");
    errCopy.status = 400;
  }

  // Mongoose Validation Error
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((val) => val.message);
    errCopy = new Error(message.join(", "));
    errCopy.status = 400;
  }

  // Return JSON response
  res.status(errCopy.status || 500).json({
    message: errCopy.message || "Internal Server Error",
  });
};

export default errMiddleware;
