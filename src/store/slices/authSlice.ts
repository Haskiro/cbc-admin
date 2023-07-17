import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {User} from "../../types/user.type.ts";

export interface AuthState {
    user: User | null;
    token: string;
    authStatus: "idle" | "loading" | "succeeded" | "failed"
}

const initialState: AuthState = {
    user: null,
    token: "",
    authStatus: "idle"
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // incrementByAmount: (state, action: PayloadAction<number>) => {
        //     state.value += action.payload
        // },
    },
    // extraReducers(builder) {
    //     builder
    //         .addCase(login.pending, (state) => {
    //             state.authStatus = "loading";
    //         })
    //         .addCase(
    //             login.fulfilled,
    //             (state, action: PayloadAction<IAccessToken>) => {
    //                 state.authStatus = "succeeded";
    //                 state.accessToken = action.payload.access;
    //             }
    //         )
    //         .addCase(login.rejected, (state) => {
    //             state.authStatus = "failed";
    //         })
    // }
})

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = counterSlice.actions
//
// export default counterSlice.reducer