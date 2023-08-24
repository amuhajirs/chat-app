import { Router } from "express";
import { register, login, forgot, reset, logout, loggedIn, getData, updateUser, deleteAvatar, verifyToken, generateVerifyEmail, verifyEmail } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../config/multer.js";

const router = Router();

// /api/auth

// Register user
router.post('/register', uploadAvatar.single('avatar'), register);

// Generate OTP for Verify Email and check unique for email and username
router.post('/verify-email/generate', generateVerifyEmail);

// Generate OTP for Verify Email and check unique for email and username
router.post('/verify-email', verifyEmail);

// Login
router.post('/login', login);

// Update user
router.patch('/update', authMiddleware, uploadAvatar.single('avatar'), updateUser);

// Delete avatar
router.delete('/delete-avatar', authMiddleware, deleteAvatar)

// Forgot password
router.post('/forgot', forgot);

// Verify the token to reset password
router.post('/verify-token', verifyToken);

// Reset Password
router.post('/reset', reset);

// Logout
router.get('/logout', logout);

// Check login or not
router.get('/loggedin', loggedIn);

// Get data chats and friends
router.get('/data', authMiddleware, getData);

export default router;
