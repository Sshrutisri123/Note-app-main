import express from 'express';
import { signup, signin, signout} from '../Controller/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", verifyToken, signout);

export default router;