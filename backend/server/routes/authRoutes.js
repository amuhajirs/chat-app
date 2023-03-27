import { Router } from "express";
import { register, login, logout, loggedIn } from "../controller/authController.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/loggedin', loggedIn);

export default router;
