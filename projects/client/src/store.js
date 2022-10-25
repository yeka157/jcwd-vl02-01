import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import addressReducer from './slices/addressSlice';
import cartReducer from './slices/cartSlices';

export const store = configureStore({
    reducer: {
        user: userReducer,
        address : addressReducer,
        cart: cartReducer
    },
})