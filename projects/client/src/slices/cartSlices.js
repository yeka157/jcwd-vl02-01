import { createSlice } from "@reduxjs/toolkit";

const initialState = [];;

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers : {
        userCart : (state, action) => {
            // console.log('ini action payload:', action.payload);
            return action.payload        
        },
        cartLogOut: (state, action) => {
            state = initialState
            return state
        }
    }
})

export const getCart = (state) => state.cart;

export const { userCart, cartLogOut } = cartSlice.actions

export default cartSlice.reducer