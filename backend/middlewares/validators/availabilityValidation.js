const availabilityValidation = (req, res, next) => {
  const { days, startTime, endTime, slotDuration } = req.body;

  const sendError = (message) =>
    res.status(422).json({ success: false, message });

  // Days validation
  if (!Array.isArray(days) || days.length === 0) {
    return sendError("At least one working day is required.");
  }

  const allowedDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const invalidDay = days.find(
    (day) => !allowedDays.includes(day.toLowerCase()),
  );

  if (invalidDay) {
    return sendError(`Invalid day: ${invalidDay}`);
  }

  // Time validation
  if (!startTime || !endTime) {
    return sendError("Start time and end time are required.");
  }

  const parseTime = (time) => parseInt(time.replace(":", ""));

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (start >= end) {
    return sendError("Start time must be earlier than end time.");
  }

  // Slot duration validation
  if (!slotDuration || slotDuration <= 0) {
    return sendError("Slot duration must be greater than 0.");
  }

  next();
};

export default availabilityValidation;
