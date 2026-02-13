const publicBookingValidation = (req, res, next) => {
  const { workspaceSlug, name, email, startTime, endTime } = req.body;

  if (!workspaceSlug || !name || !email || !startTime || !endTime) {
    return res.status(422).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!email.includes("@")) {
    return res.status(422).json({
      success: false,
      message: "Invalid email format",
    });
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(422).json({
      success: false,
      message: "Invalid time selection",
    });
  }

  next();
};

export default publicBookingValidation;
