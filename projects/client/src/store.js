import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import addressReducer from './slices/addressSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        address : addressReducer
    },
})