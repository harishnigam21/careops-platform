import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "User",
  initialState: {
    userInfo: {
      _id: "abcdefgh123456",
      firstname: "abcd",
      middlename: "mnop",
      lastname: "wxyz",
      email: "abcdmnopwxyz18@gmail.com",
      role: "staff",
    },
    loginStatus: window.localStorage.getItem("acTk") ? true : false,
  },
  reducers: {
    //replacing whole object with userInfo object
    newUser: (state, action) => {
      state.userInfo = action.payload.userInfo;
    },
    //user login status, more beneficial with some component for user interface
    changeLoginStatus: (state, action) => {
      if (!action.payload.status) {
        window.localStorage.removeItem("acTk");
        state.loginStatus = false;
      } else {
        if (action.payload.status) {
          state.loginStatus = true;
        }
      }
    },
  },
});
export const { newUser, changeLoginStatus } = userSlice.actions;
export default userSlice.reducer;
