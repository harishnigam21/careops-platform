const serviceValidation = (req, res, next) => {
  const { handler } = req.params;

  const allowedTypes = ["email", "booking", "availability"];

  if (!handler || !allowedTypes.includes(handler.toLowerCase())) {
    return res.status(422).json({
      success: false,
      message: "Invalid service setup",
    });
  }

  console.log("Service validation successful");
  next();
};

export default serviceValidation;
