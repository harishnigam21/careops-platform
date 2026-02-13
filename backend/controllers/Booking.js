import Booking from "../models/Booking.js";
import Workspace from "../models/Workspace.js";
export const createBooking = async (req, res) => {
  const { title, date, startTime, endTime, description } = req.body;
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      owner_id: req.user.id,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (!workspace.isActive) {
      return res.status(403).json({
        message: "Workspace is inactive. Complete onboarding first.",
      });
    }

    // Find existing bookings for same workspace + date
    const existingBookings = await Booking.find({
      workspace_id: req.params.id,
      date,
    });
    // Convert new booking times
    const newStart = parseInt(startTime.replace(":", ""));
    const newEnd = parseInt(endTime.replace(":", ""));
    // Check overlap
    const isOverlapping = existingBookings.some((booking) => {
      const existingStart = parseInt(booking.startTime.replace(":", ""));
      const existingEnd = parseInt(booking.endTime.replace(":", ""));

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (isOverlapping) {
      return res.status(409).json({
        message: "Time slot already booked. Please choose another time.",
      });
    }

    const newBooking = {
      workspace_id: req.params.id,
      title,
      date,
      startTime,
      endTime,
      description,
      created_by: req.user.id,
    };
    const booking = await Booking.create(newBooking);
    await booking.populate({
      path: "created_by",
      select: "_id firstname",
    });
    const response = {
      _id: booking._id,
      title: booking.title,
      createdAt: booking.createdAt,
      startTime: booking.startTime,
      created_by:
        booking.created_by._id == req.user.id
          ? "you"
          : booking.created_by.firstname,
    };
    console.log("Created new Booking");
    return res
      .status(200)
      .json({ message: "Created new Booking", data: response });
  } catch (error) {
    console.error("Error from createBooking controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.find({ workspace_id: req.params.id })
      .populate("created_by", "_id firstname")
      .select("_id title createdAt startTime")
      .sort({ createdAt: -1 })
      .lean();

    const response = booking.map((item) => ({
      _id: item._id,
      title: item.title,
      createdAt: item.createdAt,
      startTime: item.startTime,
      created_by:
        item.created_by._id == req.user.id ? "you" : item.created_by.firstname,
    }));

    console.log("Fetched Booking");
    return res.status(200).json({ message: "Fetched Booking", data: response });
  } catch (error) {
    console.error("Error from getBooking controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
