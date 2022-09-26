import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		userLogin: (state, action) => {
			return action.payload
		},
		userLogout: (state) => {
			state = initialState
		}
	}
})

export const getUser = (state) => state.user

export const { userLogin, userLogout } = userSlice.actions

export default userSlice.reducer