export const errorHandler = (err, req, res, next) => {
  // Check for Multer file size / type error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size limit exceeded. Maximum allowed PDF size is 5MB.',
    });
  }

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'An unexpected error occurred on the server.';

  // Log error internally without exposing sensitive information
  console.error(`[Server Error] [${req.method} ${req.url}] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    // Never expose stack traces in responses to the browser/client
    stack: process.env.NODE_ENV === 'development' ? undefined : undefined,
  });
};
