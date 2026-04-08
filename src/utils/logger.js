// Logs informational messages
function logInfo(message) {
    if (process.env.NODE_ENV !== "production") {
        console.log(`INFO: ${message}`);
    }
}
// Logs error messages
function logError(message, error = null) {
  if (process.env.NODE_ENV === "development" && error) {
    console.error(`ERROR: ${message}`, error);
  } else {
    console.error(`ERROR: ${message}`);
  }
}
// Export the logging functions
module.exports = {
    logInfo,
    logError
};