import WorkSpace from "../models/Workspace.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import mongoose from "mongoose";
export const createWorkSpace = async (req, res) => {
  const { name, address, email, timezone } = req.body;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const workSpaceExist = await WorkSpace.findOne({
      owner_id: req.user.id,
    }).session(session);
    if (workSpaceExist) {
      await session.abortTransaction();
      console.log("WorkSpace already Exists");
      return res.status(409).json({ message: "WorkSpace already Exists" });
    }
    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    };
    const thisSlug = generateSlug(name) + "-" + req.user.id.slice(-3); //TODO:Not necessary now, but make it more robust
    const newSpace = {
      owner_id: req.user.id,
      name,
      slug: thisSlug,
      email,
      address: address || "not provided",
      timezone,
    };
    const [workSpace] = await WorkSpace.create([newSpace], { session });
    await User.findByIdAndUpdate(
      workSpace.owner_id,
      {
        $set: { workspaceId: workSpace.id },
      },
      { session, runValidators: true },
    );
    await session.commitTransaction();
    console.log("Successfully created workspace");
    return res
      .status(201)
      .json({ message: "Successfully created workspace", data: workSpace });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error from handleRefresh controller : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await session.endSession();
  }
};

export const getPublicWorkspace = async (req, res) => {
  try {
    const workspace = await WorkSpace.findOne({
      slug: req.params.slug,
    }).select("name timezone email isActive");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (!workspace.isActive) {
      return res.status(403).json({
        message: "Workspace is not active",
      });
    }

    return res.status(200).json({
      name: workspace.name,
      timezone: workspace.timezone,
      email: workspace.email,
    });
  } catch (error) {
    console.error("Error in getPublicWorkspace:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const saveAvailability = async (req, res) => {
  const { days, startTime, endTime, slotDuration } = req.body;

  try {
    const workspace = await WorkSpace.findOne({
      _id: req.params.id,
      owner_id: req.user.id,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    workspace.availability = {
      days: days.map((d) => d.toLowerCase()),
      startTime,
      endTime,
      slotDuration,
    };

    workspace.onboarding.availabilitySetup = true;

    await workspace.save();

    console.log("Availability saved successfully");

    return res.status(200).json({
      message: "Availability saved successfully",
      data: workspace,
    });
  } catch (error) {
    console.error("Error in saveAvailability:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getPublicAvailability = async (req, res) => {
  try {
    const { slug } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const workspace = await WorkSpace.findOne({ slug });

    if (!workspace || !workspace.isActive) {
      return res.status(404).json({ message: "Workspace not available" });
    }

    if (!workspace.onboarding.availabilitySetup) {
      return res.status(400).json({ message: "Availability not configured" });
    }

    const selectedDate = new Date(date);
    const dayName = selectedDate
      .toLocaleDateString("en-US", { weekday: "short" })
      .toLowerCase();

    if (!workspace.availability.days.includes(dayName)) {
      return res.status(200).json({ slots: [] });
    }

    const { startTime, endTime, slotDuration } = workspace.availability;

    const generateTimeSlots = (start, end, duration) => {
      const slots = [];

      let [startHour, startMin] = start.split(":").map(Number);
      let [endHour, endMin] = end.split(":").map(Number);

      let current = new Date(selectedDate);
      current.setHours(startHour, startMin, 0);

      const endDate = new Date(selectedDate);
      endDate.setHours(endHour, endMin, 0);

      while (current < endDate) {
        const slotStart = new Date(current);
        current.setMinutes(current.getMinutes() + duration);
        const slotEnd = new Date(current);

        if (slotEnd <= endDate) {
          slots.push({
            start: slotStart,
            end: slotEnd,
          });
        }
      }

      return slots;
    };

    const allSlots = generateTimeSlots(startTime, endTime, slotDuration);

    // Fetch existing bookings for that date
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      workspace_id: workspace._id,
      startTime: { $gte: dayStart, $lte: dayEnd },
    });

    const availableSlots = allSlots.filter((slot) => {
      return !existingBookings.some((booking) => {
        return slot.start < booking.endTime && slot.end > booking.startTime;
      });
    });
    const now = new Date();
    const filteredSlots = availableSlots.filter((slot) => {
      return slot.start > now;
    });
    return res.status(200).json({
      date,
      slots: filteredSlots,
    });
  } catch (error) {
    console.error("Error in getPublicAvailability:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateWorkSpace = async (req, res) => {}; //TODO:currently not required
export const deleteWorkSpace = async (req, res) => {}; //TODO:currently not required
