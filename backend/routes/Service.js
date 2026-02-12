import express from "express";
import jwtVerifier from "../middlewares/jwt/jwtVerifier.js";
import { activateService } from "../controllers/Service.js";
import serviceValidation from "../middlewares/validators/serviceValidation.js";
import Validate from "../middlewares/validators/mongooseIDValidation.js";
const router = express.Router();
router
  .route("/service/:id/:handler")
  .patch(jwtVerifier, Validate, serviceValidation, activateService);
export default router;
