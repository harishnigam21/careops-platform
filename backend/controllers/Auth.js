import Users from "../models/User.js";
import Workspaces from "../models/Workspace.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const LogIn = async (req, res) => {
  const { email } = req.body;
  try {
    const ExistingUser = await Users.findOne({ email })
      .select("+password +_id")
      .lean();
    if (!ExistingUser) {
      console.error("Non-Registered User trying to login : ", email);
      return res.status(404).json({ message: "You are not registered yet !" });
    }
    const comparePassword = await bcrypt.compare(
      req.body.password,
      ExistingUser.password,
    );
    if (!comparePassword) {
      console.error("Incorrect password received from : ", ExistingUser.email);
      return res
        .status(401)
        .json({ message: "Incorrect Password, Please try again" });
    }
    const access_token = jwt.sign(
      { id: ExistingUser._id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "1d" },
    );
    const refresh_token = jwt.sign(
      { id: ExistingUser._id },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "7d" },
    );
    const updateRefreshToken = await Users.findByIdAndUpdate(
      ExistingUser._id,
      {
        $set: { refreshToken: refresh_token },
      },
      { new: true, runValidators: true },
    )
      .populate(
        "workspaceId",
        "_id name address timezone email isActive onboarding",
      )
      .lean();
    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); //TODO: add secure:true at production level
    console.log("Successfully Verified User : ", ExistingUser.email);
    return res.status(200).json({
      message: "Successfully Verified User",
      actk: access_token,
      user: updateRefreshToken,
    });
  } catch (error) {
    console.error("Error from LogIn controller : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Register = async (req, res) => {
  try {
    const { firstname, middlename, lastname, email, password, role } = req.body;
    const userExist = await Users.findOne({ email });

    if (userExist) {
      console.error(
        "Registered User trying to register again : ",
        userExist.email,
      );
      return res.status(403).json({ message: "Email ID already exist" });
    }
    const encryptedPassword = await bcrypt.hash(password, 5);
    const newUser = {
      firstname,
      middlename: middlename || "",
      lastname,
      email,
      password: encryptedPassword,
      role,
    };
    const createUser = await Users.create(newUser);
    if (!createUser) {
      console.error("Failed to create new User");
      return res.status(503).json({ message: "Failed to create new User" });
    }
    console.log("Successfully Created User : ", email);
    return res
      .status(201)
      .json({ message: "User has been registered Successfully " });
  } catch (error) {
    console.error("Error occurred at Register Controller : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
//TODO: Not necessary now, priority-low
export const ForgotPassword = async (req, res) => {};

//This controller will handle the regeneartion of access token until refresh token is valid, if all thinks good, it will take refresh token from cookie, match refresh token in DB to find out user, if got valid user then verifying it using jwt, if verified regenerating access token for that user and sending it through response
export const handleRefresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res.status(401).json({ message: "Cookie missing" });
    const findUser = await Users.findOne({ refreshToken: cookies.jwt })
      .select("+refreshToken +_id")
      .populate(
        "workspaceId",
        "_id name address timezone email isActive onboarding",
      )
      .lean();
    if (!findUser) {
      res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.status(403).json({ message: "Invalid payload" });
    }
    const { refreshToken, createdAt, updatedAt, __v, ...other } = findUser;
    jwt.verify(
      findUser.refreshToken,
      process.env.REFRESH_TOKEN_KEY,
      (err, decoded) => {
        if (err || findUser._id != decoded.id)
          return res.status(403).json({ status: false });
        const access_token = jwt.sign(
          { id: decoded.id },
          process.env.ACCESS_TOKEN_KEY,
          { expiresIn: "1d" },
        );
        return res.status(200).json({ acTk: access_token, userInfo: other });
      },
    );
  } catch (error) {
    console.error("Error from handleRefresh controller : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//This controller handles user logout, which will validated user, in both cases it will wipe out refresh token from cookie, so that further access token generation can be avoided
export const logOut = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res.status(401).json({ message: "Cookie missing" });
    const findUser = await Users.findOne({ refreshToken: cookies.jwt })
      .select("+refreshToken +_id")
      .lean();
    if (!findUser) {
      res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); //TODO:Add secure:true at production side
      return res.status(200).json({ status: true });
    }
    await Users.findOneAndUpdate(
      {
        refreshToken: findUser.refreshToken,
      },
      { $set: { refreshToken: "" } },
    );
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); //TODO:Add secure:true at production side
    return res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error from logOut controller : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
