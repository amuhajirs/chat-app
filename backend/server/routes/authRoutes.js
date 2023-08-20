import { Router } from "express";
import { register, login, forgot, reset, verify, logout, loggedIn, getData, updateUser } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";

const router = Router();

// Register user
router.post('/register', upload.single('avatar'), register);

// Login
router.post('/login', login);

// Update user
router.patch('/update', authMiddleware, upload.single('avatar'), updateUser);

// Forgot Password
router.post('/forgot', forgot);

// Verify the token to reset password
router.post('/verify', verify);

// Reset Password
router.post('/reset', reset);

// Logout
router.get('/logout', logout);

// Check login or not
router.get('/loggedin', loggedIn);

// Get data chats and friends
router.get('/data', authMiddleware, getData);

export default router;
