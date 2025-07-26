import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDetails: null, // { id, name, email, role, token }
  isAuthenticated: false,
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userDetails = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.userDetails = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = userSlice.actions;
export default userSlice.reducer; 