import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {User} from "../../types/user.type.ts";
import {LoginData} from "../../api/auth.ts";
import api, {HTTP} from "../../api"
import {Status} from "../../types/status.type.ts";
import {createAppAsyncThunk} from "../types.ts";

export interface AuthState {
    user: User | null;
    token: string | null;
    status: Status;
}

const initialState: AuthState = {
    user: null,
    token: null,
    status: "idle"
}

export const login = createAppAsyncThunk(
    "auth/login",
    async (loginData: LoginData) => {
        const response = await api.auth.loginUser(loginData);
        return response;
    }
);

export const getUserInfo = createAppAsyncThunk(
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
            console.log(state.token);
            state.user = null;
            state.status = "idle";
            state.token = null;
            HTTP.defaults.headers.common['Authorization'] = `Bearer `;
        },
        resetToken: (state) => {
            state.token = null;
            HTTP.defaults.headers.common['Authorization'] = `Bearer `;
        },
        setStatus: (state, action: PayloadAction<Status>) => {
            state.status = action.payload;
        }
    },
    extraReducers(builder) {
        builder
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

export const {logout, resetToken, setStatus} = authSlice.actions

export default authSlice.reducer