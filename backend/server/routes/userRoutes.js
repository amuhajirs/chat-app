import { Router } from "express";
import { allUsers, getFriends, editFriends } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Get all Users or search Users (query params: search)
router.get('/', authMiddleware, allUsers);

// Edit user
router.put('/edit', authMiddleware);

// Get friends of user or search (query params: search)
router.get('/friends', authMiddleware, getFriends);

// Add or remove friend
router.put('/friends/edit', authMiddleware, editFriends);

export default router;