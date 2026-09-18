import { Router } from "express";
import { vehiclesControllers } from "./vehicle.controller";
import auth from "../../middleware/auth.middleware";

const router = Router();

router.post("/", auth("admin"), vehiclesControllers.createVehicle);
router.get("/", vehiclesControllers.getVehicles);
router.get("/:vehicleId", vehiclesControllers.getSingleVehicle);
router.put("/:vehicleId", auth("admin"), vehiclesControllers.updateVehicle);
router.delete("/:vehicleId", auth("admin"), vehiclesControllers.deleteVehicle);

export const vehicleRoutes = router;
