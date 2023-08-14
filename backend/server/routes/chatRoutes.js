import { Router } from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import { allChats, accessPersonalChat, createGroup, history, updateGroup, inviteToGroup, kickFromGroup, sendMessage } from "../controller/chatController.js";

const router = Router();

// Get all recent chat
router.get('/', authMiddleware, allChats)

// Access or create Personal chat
router.post('/', authMiddleware, accessPersonalChat);

// Create Group chat
router.post('/group', authMiddleware, createGroup);

// Edit Group chat
router.put('/group/update', authMiddleware, updateGroup);

// Invite to Group chat
router.put('/group/invite', authMiddleware, inviteToGroup);

// Kick from Group chat
router.put('/group/kick', authMiddleware, kickFromGroup);

// Get all messages of chat
router.get('/:id', authMiddleware, history);

// Send message
router.post('/:id', authMiddleware, sendMessage);


export default router;