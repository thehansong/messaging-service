import { Request, Response, NextFunction } from "express";

// Interface for storage of request counts
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}


/***********************************************
 * RATE LIMITER MIDDLEWARE
 * brief: Middleware to restrict request frequency and prevent spam/abuse/human errors.
 * 
 * Functionalities:
 * - Tracks request count per client IP,
 * - Resets count after a specified time window,
 * - Sends rate limit headers to clients,
 * - Returns the 429 Too Many Requests if limit is exceeded. (I think its industry standard idk i read on stackover)
 ***********************************************/
export const rateLimiter = (windowMs: number = 60000, maxRequests: number = 100) => {
  // In-memory store for request tracking
  const store: RateLimitStore = {};

  return (req: Request, res: Response, next: NextFunction) => {
    // IP address as identifier  ||| TODO: MAYBE ID OR API KEY works too but need research more in the future.
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // Initialize or reset expired entries
    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs
      };
    }

    // Increment request count
    store[key].count++;

    // Compute remaining requests and reset time
    const remaining = Math.max(0, maxRequests - store[key].count);
    const reset = Math.ceil((store[key].resetTime - now) / 1000);
    
    // RESPONSE
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', reset.toString());

    // If limit exceeded, return Too Many Requests
    if (store[key].count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests, please try again later',
        retryAfter: reset
      });
    }

    next();
  };
};