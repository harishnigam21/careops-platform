const workSpaceValidation = (req, res, next) => {
  const { email, name, timezone } = req.body;
  const nameRegex = /^[a-zA-Z]+$/;
  // Helper to send response and stop execution immediately
  const sendError = (error) => {
    return res.status(422).json({ success: false, message: error });
  };

  // 1. Email Validation Logic
  const validateEmail = (value) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!value) {
      return "Email is required.";
    }
    if (!emailPattern.test(value)) {
      return "Please enter a valid email address.";
    }
    return null; // No error
  };

  const emailError = validateEmail(email);
  if (emailError) {
    return sendError(emailError);
  }
  //2. Name Validation Logic
  if (!name || name.length < 2 || !nameRegex.test(name)) {
    return sendError("Invalid Name (Min 2 chars, alphabets only)");
  }
  const isValidTimezone = (tz) => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch (ex) {
      return false;
    }
  };
  //3. Name Validation Logic
  if (!isValidTimezone(timezone)) {
    return sendError("Invalid TimeZone");
  }
  // If all checks pass
  console.log("WorkSpace Input Validation successful");
  next();
};

export default workSpaceValidation;
