import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {LoyaltyCard, User} from "../../types/user.type.ts";
import {LoginData} from "../../api/auth.ts";
import api, {HTTP} from "../../api"
import {Status} from "../../types/status.type.ts";
import {createAppAsyncThunk} from "../types.ts";
import {isAxiosError} from "axios";
import {blockCardLocally} from "./usersSlice.ts";
import {CustomError} from "../../types/customError.ts";

export interface AuthState {
    user: User | null;
    token: string | null;
    status: Status;
    error: string | null;
    changePasswordStatus: Status
}

const initialState: AuthState = {
    user: null,
    token: null,
    status: "idle",
    error: null,
    changePasswordStatus: "idle"
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
    async (_, {rejectWithValue}) => {
        const response = await api.auth.getCurrentUserInfo();
        return response;
    }
);

export const changePassword = createAppAsyncThunk(
    "auth/changePassword",
    async (passwordData: { password: string, newPassword: string }) => {
            const response = await api.auth.changePassword(passwordData);
            return response;
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.status = "idle";
            state.token = null;
        },
        resetToken: (state) => {
            state.token = null;
        },
        setStatus: (state, action: PayloadAction<Status>) => {
            state.status = action.payload;
        },
        setChangePasswordStatus: (state, action: PayloadAction<Status>) => {
            state.changePasswordStatus = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.status = "succeeded";
                    state.token = action.payload;
                }
            )
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || null;
            })
            .addCase(
                getUserInfo.fulfilled,
                (state, action: PayloadAction<User>) => {
                    state.status = "succeeded";
                    state.user = action.payload;
                }
            )
            .addCase(getUserInfo.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || null;
            })
            .addCase(
                changePassword.fulfilled,
                (state) => {
                    state.changePasswordStatus = "succeeded";
                }
            )
            .addCase(changePassword.rejected, (state, action) => {
                state.changePasswordStatus = "failed";
                state.error = action.error.message || null;
            })
    }
})

export const {
    logout,
    resetToken,
    setStatus,
    setChangePasswordStatus,
    clearError
} = authSlice.actions

export default authSlice.reducer