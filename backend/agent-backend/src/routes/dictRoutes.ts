import express from 'express';
import { DictController } from '../controllers/dictController';
import { auth } from '../middlewares/auth';

const router = express.Router();
const dictController = new DictController();

router.get('/getDicts', auth, dictController.getDicts);

export default router;
