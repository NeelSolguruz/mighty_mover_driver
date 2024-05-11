import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentPage: '',
};

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
});

export const { setPage } = pageSlice.actions;

export default pageSlice.reducer;
