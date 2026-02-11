import mongoose from "mongoose";
const workspaceSchema = mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    timezone: {
      type: String,
      required: true,
      enum: Intl.supportedValuesOf("timeZone"),
      default: "UTC",
    },
    email: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    onboarding: {
      emailSetup: { type: Boolean, default: false },
      bookingSetup: { type: Boolean, default: false },
      availabilitySetup: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);
workspaceSchema.index({ owner_id: 1 }, { unique: true });
workspaceSchema.index({ createdAt: -1 });
export default mongoose.model("workspaces", workspaceSchema);
