import { createSlice } from "@reduxjs/toolkit"; 
interface User {
  first_name: string;
  last_name: string;
  email: string;
}
interface Permission {
  section: null | string;
  permission: null | string[];
}

interface initialState {
  user: {
    id: null | string;
    first_name: null | User;
    last_name: null | User;
    email: null | User;
    token: null | string;
    permission: null | Permission[];
    is_super_admin: string | boolean;
  };
}

const localState = localStorage.getItem("user") || "";
const userData = localState && JSON.parse(localState || "");

const initialState: initialState = {
  user: {
    id: userData?.id || null,
    first_name: userData?.first_name || null,
    last_name: userData?.last_name || null,
    email: userData?.email || null,
    token: userData?.token || null,
    permission: userData?.permission || null,
    is_super_admin: userData?.is_super_admin || null,
  },
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    AdminAdd: (state, action) => {
      state.user = action.payload;
    },
    Adminlogout: (state) => {
      state.user = {
        id: null,
        first_name: null,
        last_name: null,
        email: null,
        token: null,
        permission: null,
        is_super_admin: false,
      };
      localStorage.clear();
    },
    Categoriedata: (state, action) => {
      state.user = action.payload;
    },
    // resetState: () => initialState,
  },
});
export const { AdminAdd, Adminlogout, Categoriedata } = userSlice.actions;
export default userSlice.reducer;
