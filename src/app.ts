import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import messageRoutes from "./routes/message.routes";
import chatRoutes from "./routes/chat.routes";
import { rateLimiter } from "./middleware/rateLimiter";


/***********************************************
 * EXPRESS APP CONFIGURATION
 * brief: Initializes the Express app with middleware and route handling.
 * 
 * Functionalities:
 * - Enables CORS and JSON body parsing,
 * - Applies rate limiting to prevent abuse,
 * - Registers chat and message routes,
 * - Handles 404 and global errors.
 ***********************************************/
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Apply rate limiter to all routes |  100 requests per minute
app.use(rateLimiter(60000, 100) as express.RequestHandler);

// register routes
app.use("/messages", messageRoutes);
app.use("/chats", chatRoutes);

// 404 errors handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
