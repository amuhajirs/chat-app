import { Router } from "express";
import { searchUser, getFriends, editFriends } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Get all Users or search Users (query params: search)
router.get('/:username', authMiddleware, searchUser);

// Get friends of user or search (query params: search)
router.get('/friends', authMiddleware, getFriends);

// Add or remove friend
router.put('/friends/edit', authMiddleware, editFriends);

export default router;