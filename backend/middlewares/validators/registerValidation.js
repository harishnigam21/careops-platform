const registerValidation = (req, res, next) => {
  const {
    firstname,
    middlename,
    lastname,
    email,
    password,
    cnfPassword,
    role,
  } = req.body;
  const nameRegex = /^[a-zA-Z]+$/;

  const sendError = (error) => {
    console.error(error);
    return res.status(422).json({ success: false, message: error });
  };

  if (password !== cnfPassword) {
    return sendError("Passwords do not match");
  }

  if (!firstname || firstname.length < 2 || !nameRegex.test(firstname)) {
    return sendError("Invalid First Name (Min 2 chars, alphabets only)");
  }
  if (middlename && (middlename.length < 2 || !nameRegex.test(middlename))) {
    return sendError("Invalid Middle Name (Min 2 chars, alphabets only)");
  }
  if (!lastname || lastname.length < 2 || !nameRegex.test(lastname)) {
    return sendError("Invalid Last Name (Min 2 chars, alphabets only)");
  }

  const validateInput = (type, value) => {
    const patterns = {
      password:
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|~`-])[^\s]{8,}$/,
      name: /^[a-zA-Z]+$/,
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    };
    const userRole = ["owner", "staff"];

    switch (type) {
      case "password":
        if (!value) return sendError("Password is required.");
        if (/\s/.test(value))
          return sendError("Password cannot contain spaces.");
        if (!/(?=.*[A-Z])/.test(value))
          return sendError("Password needs at least one capital letter.");
        if (!/(?=.*\d)/.test(value))
          return sendError("Password needs at least one number.");
        if (!/(?=.*[!@#$%^&*()_+])/.test(value))
          return sendError("Password needs at least one symbol.");
        if (value.length < 8)
          return sendError("Password must be at least 8 characters long.");
        break;

      case "email":
        if (!value) return sendError("Email is required.");
        if (!patterns.email.test(value))
          return sendError("Please enter a valid email address.");
        break;
      case "role":
        if (!userRole.includes(role))
          return sendError("Please select valid role");
        break;
    }
    return null;
  };

  if (validateInput("email", email)) return;
  if (validateInput("password", password)) return;

  console.log("Registration Input Validation done");
  next();
};

export default registerValidation;
