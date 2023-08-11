import { Router } from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import { allChats, accessPersonalChat, createGroup, history, updateGroup, inviteToGroup, kickFromGroup } from "../controller/chatController.js";

const router = Router();

// Get all recent chat
router.get('/', authMiddleware, allChats)

// Access or create Personal chat
router.post('/', authMiddleware, accessPersonalChat);

// Create Group chat
router.post('/group', authMiddleware, createGroup);

// Edit Group chat
router.put('/group/:id/update', authMiddleware, updateGroup);

// Invite to Group chat
router.put('/group/:id/invite', authMiddleware, inviteToGroup);

// Kick from Group chat
router.put('/group/:id/kick', authMiddleware, kickFromGroup);

// Get all messages of chat
router.get('/:id', authMiddleware, history);


export default router;