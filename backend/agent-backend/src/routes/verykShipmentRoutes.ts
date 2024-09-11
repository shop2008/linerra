import { Router } from "express";
import { VerykShipmentController } from "../controllers/veryk/verykShipmentController";
import { auth } from "../middlewares/auth";

const router = Router();
const verykShipmentController = new VerykShipmentController();

router.use(auth);

router.get("/getAvailableCarriers", verykShipmentController.getAvailableCarriers);
router.post("/quote", verykShipmentController.quote);
router.post("/save", verykShipmentController.save);
router.get("/get/:number", verykShipmentController.get);
router.get("/page", verykShipmentController.getPage);
router.get("/shipmentList", verykShipmentController.shipmentList);
router.get("/shipmentDetail/:id", verykShipmentController.shipmentDetail);
export default router;
