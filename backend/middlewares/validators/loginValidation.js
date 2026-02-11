const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

  // Helper to send response and stop execution immediately
  const sendError = (error) => {
    return res.status(422).json({ success: false, message:error });
  };

  // 1. Password Check
  // Following your logic: check if empty or less than 2 characters
  if (!password || password.trim().length < 2) {
    return sendError("Password is required and must be at least 2 characters long.");
  }

  // 2. Email Validation Logic
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

  // If all checks pass
  console.log("Login Input Validation successful");
  next();
};

export default loginValidation;