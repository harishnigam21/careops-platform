const bookingValidation = (req, res, next) => {
  const { title, date, startTime, endTime } = req.body;

  // Helper to send response and stop execution immediately
  const sendError = (error) => {
    return res.status(422).json({ success: false, message: error });
  };

  //Title Validation
  if (!title || title.length < 3) {
    return sendError("Tile not valid, require atleast 3 character");
  }

  //Date validation
  if (!date) {
    return sendError("Missing Date");
  }
  const bookingDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(bookingDate.getTime()) || bookingDate < today) {
    return sendError("Invalid date or date is in the past");
  }

  //Time Validation
  if (!startTime) {
    return sendError("Missing startTime");
  }
  const start = parseInt(startTime.replace(":", ""));
  if (!endTime) {
    return sendError("Missing endTime");
  }
  const end = parseInt(endTime.replace(":", ""));
  if (end <= start) {
    return sendError("End time must be after start time");
  }

  // If all checks pass
  console.log("Booking Input Validation successful");
  next();
};
export default bookingValidation;
