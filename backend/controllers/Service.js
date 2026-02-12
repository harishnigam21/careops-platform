import Workspace from "../models/Workspace.js";

const SERVICE_MAP = {
  email: "onboarding.emailSetup",
  booking: "onboarding.bookingSetup",
  availability: "onboarding.availabilitySetup",
};

export const activateService = async (req, res) => {
  try {
    const onboardingPath = SERVICE_MAP[req.params.handler];

    if (!onboardingPath) {
      return res.status(400).json({ message: "Invalid service handler" });
    }

    const workspace = await Workspace.findOneAndUpdate(
      {
        _id: req.params.id,
        owner_id: req.user.id,
      },
      {
        $set: { [onboardingPath]: true },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const { emailSetup, bookingSetup, availabilitySetup } =
      workspace.onboarding;

    if (emailSetup && bookingSetup && availabilitySetup) {
      workspace.isActive = true;
      await workspace.save();
    }

    return res.status(200).json({
      message: "Service activated successfully",
      data: workspace,
    });
  } catch (error) {
    console.error("Error from activateService controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
