class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

const createCustomError = (msg, statusCode) => {
  const error = new CustomAPIError(msg, statusCode)
  throw error
}

module.exports = { createCustomError, CustomAPIError }
