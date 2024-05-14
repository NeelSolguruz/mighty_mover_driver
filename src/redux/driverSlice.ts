import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  token: null | string;
  driver: null | string;
  email: null | string;
}
const localState = localStorage.getItem("Driver") || "";
const userData = localState && JSON.parse(localState || "");

const initialState: initialState = {
  token: userData.token || null,
  driver: userData.driver || null,
  email: userData.email || null,
};



const driverSlice = createSlice({
  name: "driver",
  initialState: initialState,
  reducers: {
    driverAdd: (state, action) => {
      state.token = action.payload.token;
      state.driver = action.payload.name;
      state.email = action.payload.email;
    },
    driverUpdate: (state, action) => {
      state.driver = action.payload;
    },
    driverLogout: (state) => {
      (state.token = null), (state.driver = null), (state.email = null);
    },
  },
});

export const { driverAdd, driverUpdate, driverLogout } = driverSlice.actions;
export default driverSlice.reducer;
