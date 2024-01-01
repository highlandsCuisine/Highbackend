const statusMessages = {
  200: "OK: The request was successful.",
  201: "Created: The request was successful, and a resource was created.",
  202: "Accepted: The request has been accepted for processing.",
  203: "Non-Authoritative Information: The server successfully processed the request but is returning information that may be from another source.",
  204: "No Content: The request was successful.",
  205: "Reset Content: The request was successful; the client should reset the document view.",
  206: "Partial Content: The server is delivering only part of the resource due to a range header sent by the client.",
  300: "Multiple Choices: The requested resource has multiple representations.",
  302: "Found: The requested resource has been found at a different location temporarily.",
  304: "Not Modified: The resource has not been modified since the last requested.",
  400: "Bad Request: Invalid input data.",
  401: "Unauthorized: User not authenticated.",
  403: "Forbidden: Access denied.",
  404: "Not Found: Requested URL not found.",
  405: "Method Not Allowed: Requested Method not allowed.",
  406: "Not Acceptable!",
  408: "Request Timeout: The server timed out waiting for the request.",
  409: "Conflict: Conflict occurred in the current state of the resource.",
  410: "Gone: The requested resource is no longer available.",
  411: "Length Required: The server requires a valid Content-Length header to be specified in the request.",
  412: "Precondition Failed: The server does not meet one of the preconditions specified in the request headers.",
  413: "Payload Too Large: The request is larger than the server is willing or able to process.",
  414: "URI Too Long: The URI provided was too long for the server to process.",
  415: "Unsupported Media Type: Requested media type is not supported.",
  416: "Range Not Satisfiable: The server cannot provide the requested range.",
  417: "Expectation Failed: The server cannot meet the requirements of the Expect request-header field.",
  500: "Internal Server Error: Internal server error occurred.",
  501: "Not Implemented: The server does not support the functionality required to fulfill the request.",
  503: "Service Unavailable: The server is not ready to handle the request.",
  505: "HTTP Version Not Supported: The server does not support the HTTP protocol version used in the request.",
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const success = statusCode !== 500;
  const message =
    err.message ||
    statusMessages[statusCode] ||
    "Internal Server Error: Internal server error occurred.";

  res.status(statusCode).json({
    success,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode || 500;
  }
}

module.exports = {
  errorHandler,
  ErrorHandler,
};
