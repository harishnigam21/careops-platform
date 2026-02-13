import express from "express";
import jwtVerifier from "../middlewares/jwt/jwtVerifier.js";
import {
  createBooking,
  createPublicBooking,
  getBooking,
} from "../controllers/Booking.js";
import bookingValidation from "../middlewares/validators/bookingValidation.js";
import Validate from "../middlewares/validators/mongooseIDValidation.js";
import publicBookingValidation from "../middlewares/validators/publicBookingValidation.js";
const router = express.Router();
router
  .route("/booking/:id")
  .post(jwtVerifier, Validate, bookingValidation, createBooking)
  .get(jwtVerifier, Validate, getBooking);
router.route("/public/book").post(publicBookingValidation, createPublicBooking);
export default router;
