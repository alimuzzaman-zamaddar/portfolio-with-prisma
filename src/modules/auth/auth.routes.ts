import express from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();


router.post("/register", AuthController.register); 
router.post("/login", AuthController.login); 
router.get("/verify", AuthController.verifyToken); 

router.get("/profile", auth(), AuthController.getProfile); 

export const authRouter = router;
