function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the stack trace for debugging
  
    // Check for Mongoose Validation Errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: err.message,
        details: err.errors, // Optional: include field-specific error details
      });
    }
  
    // Check for Mongoose Cast Errors (e.g., invalid ObjectId)
    if (err.name === "CastError") {
      return res.status(400).json({
        error: "Invalid ID format",
        message: err.message,
        details: err.errors, // Optional: include field-specific error details

      });
    }
  
    // Handle any other errors
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong. Please try again later.",
      details: err.errors, // Optional: include field-specific error details

    });
  }
  
  module.exports = errorHandler;
  