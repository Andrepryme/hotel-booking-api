function logError(message, error = null) {
  console.error(`[${new Date().toISOString()}] ${message}`);
  if (error && process.env.NODE_ENV !== "production") {
    console.error(error.stack);
  }
}

function logInfo(message) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`);
  }
}

module.exports = {
    logInfo,
    logError
};