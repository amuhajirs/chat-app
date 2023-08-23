import { Router } from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import {
    myChats,accessPersonalChat, createGroup, history, updateGroup, inviteToGroup, kickFromGroup, sendMessage,
    deletePersonalChat, deleteGroup, addChat, removeChat
} from "../controller/chatController.js";
import { uploadGroupPict } from '../config/multer.js';

const router = Router();

// Get my recent chat (Personal and Group Chat)
router.get('/', authMiddleware, myChats)

// Access or create Personal chat
router.post('/', authMiddleware, accessPersonalChat);

// Create Group chat
router.post('/group', authMiddleware, uploadGroupPict.single('picture'), createGroup);

// Edit Group chat
router.put('/group/update', authMiddleware, updateGroup);

// Invite to Group chat
router.put('/group/invite', authMiddleware, inviteToGroup);

// Kick from Group chat
router.put('/group/kick', authMiddleware, kickFromGroup);

// Delete group chat
router.delete('/group/:id/delete', authMiddleware, deleteGroup);

// Get all messages of chat
router.get('/messages/:id', authMiddleware, history);

// Send message
router.post('/messages/send', authMiddleware, sendMessage);

// Add chat to user
router.put('/add', authMiddleware, addChat);

// Remove chat from user
router.put('/remove', authMiddleware, removeChat);

// Delete personal chat
router.delete('/:id/delete', authMiddleware, deletePersonalChat);

// Delete personal chat
router.delete('/group/:id/delete', authMiddleware, deletePersonalChat);

export default router;