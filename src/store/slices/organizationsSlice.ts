import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import api from "../../api"
import {Organization} from "../../types/organization.type.ts";
import {Status} from "../../types/status.type.ts";
import {createAppAsyncThunk} from "../types.ts";
import {AxiosError, isAxiosError} from "axios";
import {resetToken} from "./authSlice.ts";

export interface OrganizationsState {
    organizations: Organization[];
    status: Status;
    categories: string[],
    categoriesStatus: Status,
    currentCategory: string,
}

const initialState: OrganizationsState = {
    organizations: [],
    status: "idle",
    categories: [],
    categoriesStatus: "idle",
    currentCategory: "Все"
}

export const getOrganizations = createAppAsyncThunk(
    "organizations/getOrganizations",
    async (_, {getState, dispatch, rejectWithValue}) => {
        const state = getState();
        try {
            const response = await api.organizations.getList(state.organizations.currentCategory);
            return response.map(org => ({
                ...org,
                icon: import.meta.env.VITE_API_URL + "/" + org.icon
            }));
        } catch (e) {
            if (isAxiosError(e)) {
                if (e.response?.status === 401) {
                    dispatch(resetToken());
                    return rejectWithValue("Ошибка авторизации")
                } else {
                    return rejectWithValue(e.message)
                }
            } else {
                throw e;
            }
        }
    }
);

export const organizationsSlice = createSlice({
    name: 'organizations',
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<string>) => {
            state.currentCategory = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getOrganizations.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                getOrganizations.fulfilled,
                (state, action: PayloadAction<Organization[]>) => {
                    state.status = "succeeded";
                    state.organizations = action.payload;
                }
            )
            .addCase(getOrganizations.rejected, (state) => {
                state.status = "failed";
            })
    }
})

export const {setCategory} = organizationsSlice.actions;

export default organizationsSlice.reducer