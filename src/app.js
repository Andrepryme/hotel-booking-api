const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

const app = express();
app.use(express.json());

const logger = require("./utils/logger");

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Prevent HTTP param pollution
app.use(hpp());

// Enable CORS and restrict to specific origin for better security
  app.use(
    cors({
      origin: ["http://localhost:6500", "http://localhost:5500"],
      credentials: true,
    })
  );

// Prevent brute force
app.use(
  rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000,
    message: "Too many requests, try again later",
  })
);

// Request logging
app.use((req, res, next) => {
  if (req.url.startsWith("/uploads")) {
    logger.logInfo(`STATIC: ${req.method} ${req.url}`);
  } else {
    logger.logInfo(`${req.method} ${req.originalUrl}`);
  }
  next();
});

// Importing routes
const authRoutes = require("./routes/auth/auth.route");
const apartmentRoutes = require("./routes/apartment/apartment.route");
const inquiryRoutes = require("./routes/inquiry/inquiry.route");
const bookingRoutes = require("./routes/booking/booking.route");

// Mounting routes
app.use("/api/auth", authRoutes);
app.use("/api/apartment", apartmentRoutes);
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/uploads", express.static("uploads"));

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