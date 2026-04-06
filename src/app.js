const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const { NODE_ENV } = require("./config/env");
const { logError, logInfo } = require("./utils/logger");

// Development logging middleware
if (NODE_ENV !== "production") {
    app.use((req, res, next) => {
        logInfo(`${req.method} ${req.originalUrl}`);
        next();
    });
}


// Importing routes
const authRoutes = require("./routes/auth/auth.routes");
// const apartmentRoutes = require("./routes/apartments/apartment.routes");
// const bookingRoutes = require("./routes/bookings/booking.routes");

// Mounting routes
app.use("/api/auth", authRoutes);
// app.use("/api/apartments", apartmentRoutes);
// app.use("/api/bookings", bookingRoutes);

// App-level routes health check
app.get('/', (req, res) => {
    return res.send('API is running!');
});

// 404 handler for undefined routes
app.use((req, res) => {
    logError(`Route not found: ${req.originalUrl}`);
    res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  logError(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;