import app from "./app";
import dotenv from "dotenv";


/***********************************************
 * SERVER INITIALIZATION
 * brief: Loads environment variables and starts the Express server.
 * 
 * Functionalities:
 * - Loads environment variables from .env file,
 * - Starts the Express app on the specified port,
 * - Handles process errors and graceful shutdown.
 ***********************************************/
// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server with improved logging
const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server is running on port ${PORT}`);
});


/***********************************************
 * ERROR HANDLING & SHUTDOWN LOGIC
 * 
 * - Catches uncaught exceptions,
 * - Handles unhandled promise rejections,
 * - Gracefully shuts down the server on SIGTERM/SIGINT.
 ***********************************************/
// Handle uncaught errors
process.on("uncaughtException", (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection:`, reason);
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log(`[${new Date().toISOString()}] SIGTERM received, shutting down...`);
  server.close(() => {
    console.log(`[${new Date().toISOString()}] Server shut down.`);
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log(`[${new Date().toISOString()}] SIGINT received, shutting down...`);
  server.close(() => {
    console.log(`[${new Date().toISOString()}] Server shut down.`);
    process.exit(0);
  });
});