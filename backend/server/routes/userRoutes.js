import { Router } from "express";
import { allUsers, getFriends, editFriends } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Get all Users
router.get('/', allUsers);

// Edit user
router.patch('/edit', authMiddleware);

// Get friends of user
router.get('/friends', authMiddleware, getFriends);

// Add or remove friend
router.patch('/friends/edit', authMiddleware, editFriends);

export default router;