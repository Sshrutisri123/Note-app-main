import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    errorDispatch: null,
    loading: false,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.errorDispatch = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.errorDispatch = action.payload;
        },
        signOutStart: (state) => {
            state.loading = true;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.errorDispatch = null;
        },
        signOutFailure: (state, action) => {
            state.loading = false;
            state.errorDispatch = action.payload;
        },
    },
})


export const { signInStart, signInSuccess, signInFailure, signOutStart, signOutSuccess, signOutFailure } = userSlice.actions;

export default userSlice.reducer;