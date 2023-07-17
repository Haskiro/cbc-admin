import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {User} from "../../types/user.type.ts";
import {LoginData} from "../../api/auth.ts";
import api, {HTTP} from "../../api"
import {RootState, useAppDispatch} from "../index.ts";

export interface AuthState {
    user: User | null;
    token: string;
    status: "idle" | "loading" | "succeeded" | "failed"
}

const initialState: AuthState = {
    user: null,
    token: "",
    status: "idle"
}

export const login = createAsyncThunk(
    "auth/login",
    async (loginData: LoginData) => {
        const response = await api.auth.loginUser(loginData);
        return response;
    }
);

export const getUserInfo = createAsyncThunk(
    "auth/getUserInfo",
    async () => {
        const response = await api.auth.getCurrentUserInfo();
        return response;
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.status = "idle";
            state.token = "";
            HTTP.defaults.headers.common['Authorization'] = `Bearer `;
        },
        resetToken: (state) => {
            state.token = "";
            HTTP.defaults.headers.common['Authorization'] = `Bearer `;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.status = "succeeded";
                    state.token = action.payload;
                    HTTP.defaults.headers.common['Authorization'] = `Bearer ${action.payload}`;
                }
            )
            .addCase(login.rejected, (state) => {
                state.status = "failed";
            })
            .addCase(getUserInfo.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                getUserInfo.fulfilled,
                (state, action: PayloadAction<User>) => {
                    state.status = "succeeded";
                    state.user = action.payload;
                }
            )
            .addCase(getUserInfo.rejected, (state) => {
                state.status = "failed";
            })
    }
})

export const {logout, resetToken} = authSlice.actions

export default authSlice.reducer