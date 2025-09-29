// src/types/express.d.ts

// Augment the Request type from Express to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
