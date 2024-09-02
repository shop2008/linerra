import { Router } from "express";
import { VerykShipmentController } from "../controllers/veryk/verykShipmentController";
import { auth } from "../middlewares/auth";

const router = Router();
const verykShipmentController = new VerykShipmentController();

router.use(auth);

router.get("/getAvailableCarriers", verykShipmentController.getAvailableCarriers);
router.post("/quote", verykShipmentController.quote);


export default router;
