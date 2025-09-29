import { Request, Response } from "express";
import { AuthService } from "./auth.service";

// Register a new user
const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Call the service to register the user
    const newUser = await AuthService.registerUser({ name, email, password });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
  }
};

// Login the user
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Call the service to log the user in
    const { token, user } = await AuthService.loginUser(email, password);

    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Login failed" });
  }
};

// Get current user profile
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

// Verify token
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
