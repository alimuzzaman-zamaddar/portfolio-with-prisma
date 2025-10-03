import { Request, Response } from "express";
import { AuthService } from "./auth.service";


const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await AuthService.registerUser({ name, email, password });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
  }
};


const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {

    const { token, user } = await AuthService.loginUser(email, password);

    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Login failed" });
  }
};


const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await AuthService.getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Error fetching profile",
    });
  }
};


const verifyToken = async (req: Request, res: Response) => {
  try {
    const { user } = await AuthService.verifyToken(
      req.headers.authorization?.replace("Bearer ", "") || ""
    );

    return res.status(200).json({
      success: true,
      message: "Token is valid",
      data: user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Invalid token",
    });
  }
};

export const AuthController = {
  register,
  login,
  getProfile,
  verifyToken,
};
