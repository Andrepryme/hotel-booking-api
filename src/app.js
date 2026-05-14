const express = require("express");
const helmet = require("helmet"); // Security headers
const rateLimit = require("express-rate-limit"); // Rate limiting to prevent brute force attacks
const hpp = require("hpp"); // Prevent HTTP parameter pollution
const cors = require("cors"); // Enable CORS for specific origins
const cookieParser = require("cookie-parser"); // Parse cookies
const compression = require("compression");

const app = express(); // Create Express 

app.use(compression()); // Enable gzip compression for responses
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(hpp()); // Prevent HTTP parameter pollution

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
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

// Logging middleware
const logger = require("./utils/logger");
// Log all incoming requests with method and URL
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const url = req.url.startsWith("/uploads")
      ? req.url
      : req.originalUrl;

    logger.logInfo(
      `${req.method} ${url} ${res.statusCode} in ${duration}ms`
    );
  });

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
    logger.logError(`Route not found: ${req.method} ${req.originalUrl}`);
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