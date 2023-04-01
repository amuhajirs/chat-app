import { Router } from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import { history } from "../controller/chatController.js";

const router = Router();

router.get('/history/:id', authMiddleware, history);

export default router;