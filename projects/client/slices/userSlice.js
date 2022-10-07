import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		userLogin: (state, action) => {
			console.log('ini data login', action.payload);
			return action.payload
		},
		userLogout: (state) => {
			console.log('ini data logout', state);
			state = initialState
			return state
		}
	}
})

export const getUser = (state) => state.user

export const { userLogin, userLogout } = userSlice.actions

export default userSlice.reducer