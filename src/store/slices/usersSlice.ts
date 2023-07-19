import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import api from "../../api"
import {Status} from "../../types/status.type.ts";
import {createAppAsyncThunk} from "../types.ts";
import {User} from "../../types/user.type.ts";
import {deleteOrg} from "./organizationsSlice.ts";
import {getUserInfo} from "./authSlice.ts";

export interface UsersState {
    users: User[];
    status: Status;
    createUpdateUserStatus: Status;
}

const initialState: UsersState = {
    users: [],
    status: "idle",
    createUpdateUserStatus: "idle"
}

export type EditUserParams = {
    newUserData: Partial<User>;
    id: string;
}

export const getUsers = createAppAsyncThunk(
    "users/getUsers",
    async () => {
        const response = await api.users.getList();
        return response;
    }
);

export const editUser = createAppAsyncThunk(
    "users/editUser",
    async ({newUserData, id}: EditUserParams, {dispatch, rejectWithValue}) =>  {
        const response = await api.users.editUser(newUserData);
        if (response.ok) {
                dispatch(getUserInfo());
                dispatch(editUserInfo({id, newUserData}))
        } else {
            rejectWithValue("Ошибка изменения данных пользователя");
        }
    }
)

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<Status>) => {
            state.status = action.payload;
        },
        setCreateUpdateUserStatus: (state, action: PayloadAction<Status>) => {
            state.createUpdateUserStatus = action.payload;
        },
        editUserInfo: (state, action: PayloadAction<{id: string, newUserData: Partial<User>}>) => {
            const existsUserIndex = state.users.findIndex(el => el.id === action.payload.id);
            state.users[existsUserIndex] = {
                ...state.users[existsUserIndex],
                ...action.payload.newUserData
            };
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
            .addCase(
                editUser.fulfilled,
                (state) => {
                    state.createUpdateUserStatus = "succeeded";
                }
            )
            .addCase(editUser.rejected, (state) => {
                state.createUpdateUserStatus = "failed";
            })
    }
})

export const {setStatus, editUserInfo, setCreateUpdateUserStatus} = usersSlice.actions;

export default usersSlice.reducer