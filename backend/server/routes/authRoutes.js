import { Router } from "express";
import { register, login, forgot, reset, verify, logout, loggedIn, getData } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.post('/forgot', forgot);
router.post('/verify', verify);
router.post('/reset', reset);

router.get('/logout', logout);
router.get('/loggedin', loggedIn);

router.get('/data', authMiddleware, getData)

export default router;
