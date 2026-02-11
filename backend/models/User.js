import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    refreshToken: {
      type: String,
      required: true,
      default: "Newly Registered User",
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["owner", "staff"],
        message:
          'Please choose either "owner" or "staff". {VALUE} is not allowed.',
      },
    },
    workspaceId:{}
  },
  { timestamps: true },
);
export default mongoose.model("users", userSchema);
