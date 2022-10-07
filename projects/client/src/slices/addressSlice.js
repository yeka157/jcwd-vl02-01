import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const addressSlice = createSlice({
    name : 'address',
    initialState,
    reducers : {
        userAddress : (state, action) => {
            return action.payload
        },
        addressLogout : (state, action) => {
            state = initialState
        }
    }
})

export const getAddress = (state) => state.address;

export const { userAddress, addressLogout } = addressSlice.actions

export default addressSlice.reducer