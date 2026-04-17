const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const logger = require("./utils/logger");

app.use((req, res, next) => {
    logger.logInfo(`${req.method} ${req.originalUrl}`);
    next();
});

// Importing routes
const authRoutes = require("./routes/auth/auth.route");
const apartmentRoutes = require("./routes/apartment/apartment.route");
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
  // Debbuging errors
  if (process.env.NODE_ENV !== "production") {
    logger.logError(err.message, err);
  } else {
    logger.logError(err.message);
  }

  // Known errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }

  // Unknown errors
  return res.status(500).json({message: "Internal Server Error",});
});

module.exports = app;