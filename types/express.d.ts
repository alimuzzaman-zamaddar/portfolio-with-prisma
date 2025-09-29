// Global type declarations for Express Request interface extension

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
        email?: string;
      };
    }
  }
}

export {};
