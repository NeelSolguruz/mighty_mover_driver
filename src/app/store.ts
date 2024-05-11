
import { configureStore } from '@reduxjs/toolkit';
import useReducer from '../redux/userSlice';
import pageReducer from '../redux/pageSlice';
import rolePermissionReducer from '../redux/roleSlice';

export const store = configureStore({
    reducer: {
        user: useReducer,
        page: pageReducer,
        rolePermission: rolePermissionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore['getState']>;
// export type AppDispatch = AppStore['dispatch'];