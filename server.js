// Import the app module
const app = require("./src/app");
// Import the PORT from environment configuration
const { PORT } = require("./src/config/env");
// Import the logging utility
const { logInfo } = require("./src/utils/logger");
// Start the server
app.listen(PORT, () => {
    logInfo(`Server running on port ${PORT}`);
});