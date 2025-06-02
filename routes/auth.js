// routes/auth.js
import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/login", authController.loginUser);
router.put("/forgot-password", authController.forgotPassword);
export default router;
