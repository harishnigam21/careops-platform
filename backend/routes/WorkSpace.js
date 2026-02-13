import express from "express";
import {
  createWorkSpace,
  getPublicAvailability,
  getPublicWorkspace,
  saveAvailability,
} from "../controllers/WorkSpace.js";
import workSpaceValidation from "../middlewares/validators/workSpaceValidation.js";
import jwtVerifier from "../middlewares/jwt/jwtVerifier.js";
import availabilityValidation from "../middlewares/validators/availabilityValidation.js";
import Validate from "../middlewares/validators/mongooseIDValidation.js";
const router = express.Router();
router
  .route("/workspace")
  .post(workSpaceValidation, jwtVerifier, createWorkSpace);
router
  .route("/workspace/:id/availability")
  .patch(Validate, jwtVerifier, availabilityValidation, saveAvailability);
router.route("/public/workspace/:slug").get(getPublicWorkspace);
router.get("/public/availability/:slug", getPublicAvailability);
export default router;
