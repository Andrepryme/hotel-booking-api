const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const { NODE_ENV } = require("./config/env");
const AppError = require("./utils/appError");
const logger = require("./utils/logger");

// Development logging middleware
if (NODE_ENV !== "production") {
    app.use((req, res, next) => {
        logger.logInfo(`${req.method} ${req.originalUrl}`);
        next();
    });
}


// Importing routes
const authRoutes = require("./routes/auth/auth.routes");
const apartmentRoutes = require("./routes/apartment/apartment.routes");
// const bookingRoutes = require("./routes/bookings/booking.routes");

// Mounting routes
app.use("/api/auth", authRoutes);
app.use("/api/apartment", apartmentRoutes);
app.use("/uploads", express.static("uploads"));
// app.use("/api/bookings", bookingRoutes);

// App-level routes health check
app.get('/', (req, res) => {
    return res.send('API is running!');
});

// 404 handler for undefined routes
app.use((req, res) => {
    logger.logError(`Route not found: ${req.originalUrl}`);
    res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    logger.logError(err.message, err);
  } else {
    logger.logError(err.message);
  }

  // Known errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Unknown errors
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
});
module.exports = app;