import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentPage: '',
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotificationPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
});

export const { setNotificationPage } = notificationSlice.actions;

export default notificationSlice.reducer;
