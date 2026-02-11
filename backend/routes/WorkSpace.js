import express from "express";
import { createWorkSpace } from "../controllers/WorkSpace.js";
import workSpaceValidation from "../middlewares/validators/workSpaceValidation.js";
import jwtVerifier from "../middlewares/jwt/jwtVerifier.js";
const router = express.Router();
router
  .route("/workspace")
  .post(workSpaceValidation, jwtVerifier, createWorkSpace);
export default router;
