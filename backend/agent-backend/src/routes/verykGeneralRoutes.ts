import express from 'express';
import { auth } from '../middlewares/auth';
import { VerykGeneralController } from '../controllers/veryk/verykGeneralController';

const router = express.Router();
const verykGeneralController = new VerykGeneralController();

router.use(auth);

router.get('/getCarriers', verykGeneralController.getCarriers);
router.get('/getProvinces', verykGeneralController.getProvinces);
router.get('/getRegions', verykGeneralController.getRegions);

export default router;
