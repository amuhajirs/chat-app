import { Router } from "express";
import { people } from "../controller/userController.js";

const router = Router();

router.get('/', people);
router.patch('/:username/edit');
router.get('/:username/friend');
router.patch('/:username/friend');

export default router;