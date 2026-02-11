import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice.js";
//configuring store
const myStore = configureStore({
  reducer: { user: userSlice },
});
export default myStore;
