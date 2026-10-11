import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: DemoUser | null;
}

export const initialAuthState: AuthState = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    registerDemoUser(state, action: PayloadAction<DemoUser>) {
      state.user = action.payload;
    },
    logoutDemoUser(state) {
      state.user = null;
    },
  },
});

type AuthRootState = Readonly<{ auth: AuthState }>;

export const { logoutDemoUser, registerDemoUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const selectDemoUser = (state: AuthRootState) => state.auth.user;
