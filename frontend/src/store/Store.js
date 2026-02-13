import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice.js";
import bookingSlice from "./Slices/bookingSlice.js";
//configuring store
const myStore = configureStore({
  reducer: { user: userSlice, booking: bookingSlice },
});
export default myStore;
