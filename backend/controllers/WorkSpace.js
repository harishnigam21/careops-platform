import WorkSpace from "../models/Workspace.js";
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
    const newSpace = {
      owner_id: req.user.id,
      name,
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
export const updateWorkSpace = async (req, res) => {}; //TODO:currently not required
export const deleteWorkSpace = async (req, res) => {}; //TODO:currently not required
