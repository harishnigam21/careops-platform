import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "User",
  initialState: {
    userInfo: null,
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
    updateWorkSpace: (state, action) => {
      state.userInfo.workspaceId = action.payload.data;
    },
  },
});
export const { newUser, changeLoginStatus, updateWorkSpace } =
  userSlice.actions;
export default userSlice.reducer;
