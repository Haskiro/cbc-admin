import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import api from "../../api"
import {Status} from "../../types/status.type.ts";
import {createAppAsyncThunk} from "../types.ts";
import {User, UserCreate} from "../../types/user.type.ts";
import {getUserInfo} from "./authSlice.ts";
import {withTimeout} from "../../utils/withTimeout.ts";
import {setStatus as setAuthStatus} from "./authSlice.ts";
import {createOrganization} from "./organizationsSlice.ts";

export interface UsersState {
    users: User[];
    status: Status;
    createUpdateUserStatus: Status;
    error: string | null;
}

const initialState: UsersState = {
    users: [],
    status: "idle",
    createUpdateUserStatus: "idle",
    error: null
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
            dispatch(setStatus("loading"));
            dispatch(setAuthStatus("loading"));
            withTimeout(() => {
                dispatch(getUserInfo());
                dispatch(editUserInfo({id, newUserData}))
            });
        } else {
            rejectWithValue("Ошибка изменения данных пользователя");
        }
    }
)

export const createClient  = createAppAsyncThunk(
    "users/createClient",
    async (newUser: UserCreate, {dispatch, rejectWithValue}) =>  {
        const response = await api.users.createClient(newUser);
        if (response.id) {
            dispatch(setStatus("loading"));
            withTimeout(() => dispatch(getUsers()));
        } else {
            rejectWithValue("Ошибка создания пользователя");
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
            .addCase(editUser.rejected, (state, action) => {
                state.createUpdateUserStatus = "failed";
                state.error = action.payload || null;
            })
            .addCase(
                createClient.fulfilled,
                (state) => {
                    state.createUpdateUserStatus = "succeeded";
                }
            )
            .addCase(createClient.rejected, (state, action) => {
                state.createUpdateUserStatus = "failed";
                state.error = action.payload || null;
            })
    }
})

export const {setStatus, editUserInfo, setCreateUpdateUserStatus} = usersSlice.actions;

export default usersSlice.reducer