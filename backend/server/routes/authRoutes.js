import { Router } from "express";
import { register, login, forgot, reset, verify, logout, loggedIn } from "../controller/authController.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.post('/forgot', forgot);
router.post('/verify', verify);
router.post('/reset', reset);

router.get('/logout', logout);
router.get('/loggedin', loggedIn);

export default router;
