import { Router } from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import {
    myChats,accessPersonalChat, createGroup, history, updateGroup, inviteToGroup, kickFromGroup, sendMessage,
    deletePersonalChat, deleteGroup
} from "../controller/chatController.js";

const router = Router();

// Get my recent chat (Personal and Group Chat)
router.get('/', authMiddleware, myChats)

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

// Delete group chat
router.delete('/group/:id/delete', authMiddleware, deleteGroup);

// Delete personal chat
router.delete('/:id/delete', authMiddleware, deletePersonalChat);

// Get all messages of chat
router.get('/:id', authMiddleware, history);

// Send message
router.post('/:id', authMiddleware, sendMessage);

export default router;