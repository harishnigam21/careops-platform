import { createSlice } from "@reduxjs/toolkit";
const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
  },
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload.data;
    },
    addBookings: (state, action) => {
      state.bookings = [...state.bookings, action.payload.data];
    },
  },
});
export const { setBookings, addBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
