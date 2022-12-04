import { createSlice } from "@reduxjs/toolkit";
import { UserRedux } from "../types/reduxTypes";

const initialState: UserRedux = {
  user: {
    authToken: "",
    creator: ""
  },
  isLoggedIn: false,
}

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    logIn: (state, action) => {
        state.user = {...state.user, ...action.payload}
        state.isLoggedIn = true
    },
    logOut: (state, action) => {
      state.user = {...state.user, ...action.payload}
      state.isLoggedIn = false
    }
  }
})

export const {logIn, logOut} = userSlice.actions
export default userSlice.reducer

/**    signIn: (state, action) => {
      state.user = {...state.user, ...action.payload}
      state.isLoggedIn = true
    },
    signOut: (state) => {
      state.user = {}
      state.isLoggedIn = false
    }, */