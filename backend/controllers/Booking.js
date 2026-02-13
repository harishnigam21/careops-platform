import Booking from "../models/Booking.js";
import Workspace from "../models/Workspace.js";
export const createBooking = async (req, res) => {
  try {
    const { name, email, startTime, endTime } = req.body;
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace || !workspace.isActive) {
      return res.status(404).json({ message: "Workspace not available" });
    }
    if (!workspace.onboarding.availabilitySetup) {
      return res.status(400).json({ message: "Availability not configured" });
    }
    const start = new Date(startTime);
    const end = new Date(endTime);

    const existingBooking = await Booking.findOne({
      workspace_id: req.params.id,
      email: email,
      status: { $ne: "completed" },
    });
    if (existingBooking) {
      return res.status(409).json({
        message: "You already booked a Slot..",
      });
    }
    // Double safety overlap check
    const overlapBooking = await Booking.findOne({
      workspace_id: req.params.id,
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (overlapBooking) {
      return res.status(409).json({
        message: "Slot already booked. Please select another time.",
      });
    }

    const booking = await Booking.create({
      workspace_id: req.params.id,
      name,
      email,
      date: startTime.slice(0, 10),
      startTime: start,
      endTime: end,
      status: "confirmed",
      booked_by:
        req.params.id == req.user.workspaceId ? "You" : req.user.firstname,
    });

    return res.status(201).json({
      message: "Booking confirmed successfully",
      data: {
        _id: booking._id,
        name: booking.name,
        email: booking.email,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        booked_by: booking.booked_by,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.find({ workspace_id: req.params.id })
      .select("_id name email createdAt startTime endTime status booked_by")
      .sort({ createdAt: -1 })
      .lean();
    console.log("Fetched Booking");
    return res.status(200).json({ message: "Fetched Booking", data: booking });
  } catch (error) {
    console.error("Error from getBooking controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const createPublicBooking = async (req, res) => {
  try {
    const { workspaceSlug, name, email, startTime, endTime } = req.body;

    const workspace = await Workspace.findOne({ slug: workspaceSlug });

    if (!workspace || !workspace.isActive) {
      return res.status(404).json({ message: "Workspace not available" });
    }

    if (!workspace.onboarding.availabilitySetup) {
      return res.status(400).json({ message: "Availability not configured" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    const existingBooking = await Booking.findOne({
      workspace_id: workspace._id,
      email: email,
      status: { $ne: "completed" },
    });
    if (existingBooking) {
      return res.status(409).json({
        message: "You already booked a Slot..",
      });
    }
    // Double safety overlap check
    const overlapBooking = await Booking.findOne({
      workspace_id: workspace._id,
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (overlapBooking) {
      return res.status(409).json({
        message: "Slot already booked. Please select another time.",
      });
    }

    const booking = await Booking.create({
      workspace_id: workspace._id,
      name,
      email,
      date: startTime.slice(0, 10),
      startTime: start,
      endTime: end,
      status: "confirmed",
    });

    return res.status(201).json({
      message: "Booking confirmed successfully",
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("Error in createPublicBooking:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
