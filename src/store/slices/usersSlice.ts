import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import api from "../../api"
import {Organization} from "../../types/organization.type.ts";
import {Status} from "../../types/status.type.ts";
import {createAppAsyncThunk} from "../types.ts";
import {AxiosError, isAxiosError} from "axios";
import {resetToken} from "./authSlice.ts";
import {User} from "../../types/user.type.ts";

export interface UsersState {
    users: User[];
    status: Status;
}

const initialState: UsersState = {
    users: [],
    status: "idle",
}

export const getUsers = createAppAsyncThunk(
    "users/getUsers",
    async (_, {getState, dispatch, rejectWithValue}) => {
        const state = getState();
        const response = await api.users.getList();
        return response;
    }
);

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<Status>) => {
            state.status = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(
                getUsers.fulfilled,
                (state, action: PayloadAction<User[]>) => {
                    state.status = "succeeded";
                    state.users = action.payload;
                }
            )
            .addCase(getUsers.rejected, (state) => {
                state.status = "failed";
            })
    }
})

export const {setStatus} = usersSlice.actions;

export default usersSlice.reducer