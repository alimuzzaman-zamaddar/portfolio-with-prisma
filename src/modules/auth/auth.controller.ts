import { Request, Response } from "express";
import { AuthService } from "./auth.service";

// Login with email and password
const loginWithEmailAndPassword = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginWithEmailAndPassword(req.body);
    res.status(200).json(result); // Return the JWT token and user info
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    res.status(500).send({ message: "Error logging in", error: errorMessage });
  }
};

// Google Authentication
const authWithGoogle = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.authWithGoogle(req.body);
    res.status(200).json(result); // Return the user info after OAuth
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error authenticating with Google",
        error: error instanceof Error ? error.message : String(error),
      });
  }
};

export const AuthController = {
  loginWithEmailAndPassword,
  authWithGoogle,
};
