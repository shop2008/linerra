import express from 'express';
import { VerykApi } from '../controllers/verykApi';

const router = express.Router();
const verykApi = new VerykApi();

router.get('/getRegion', verykApi.getRegion);
router.get('/getProvince', verykApi.getProvince);
router.get('/getCarrier', verykApi.getCarrier);
router.get('/getService', verykApi.getService);
router.get('/getAccount', verykApi.getAccount);
router.post('/quote', verykApi.quote);
export default router;
