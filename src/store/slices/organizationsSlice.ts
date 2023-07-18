import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import api from "../../api"
import {Organization, OrganizationNew} from "../../types/organization.type.ts";
import {Status} from "../../types/status.type.ts";
import {createAppAsyncThunk} from "../types.ts";
import {isAxiosError} from "axios";
import {resetToken} from "./authSlice.ts";

export interface OrganizationsState {
    organizations: Organization[];
    status: Status;
    createOrgStatus: Status;
    error: string | null,
    categories: string[],
    categoriesStatus: Status,
    currentCategory: string,
}

const initialState: OrganizationsState = {
    organizations: [],
    status: "idle",
    createOrgStatus: "idle",
    error: null,
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

export const createOrganization = createAppAsyncThunk(
    "organizations/createOrganization",
    async (newOrg: Omit<OrganizationNew, "icon"> & {
        icon: File;
    }, {dispatch, rejectWithValue}) => {
        try {
            const response = await api.organizations.createOrganization(newOrg);
            return response;
        } catch (e) {
            if (isAxiosError(e)) {
                if (e.response?.status === 401) {
                    dispatch(resetToken());
                    return rejectWithValue("Ошибка авторизации")
                } else {
                    console.log(e.response)
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
        },
        setStatus: (state, action: PayloadAction<Status>) => {
            state.status = action.payload;
        },
        setCreateOrgStatus: (state, action: PayloadAction<Status>) => {
            state.createOrgStatus = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(
                getOrganizations.fulfilled,
                (state, action: PayloadAction<Organization[]>) => {
                    state.status = "succeeded";
                    state.organizations = action.payload;
                }
            )
            .addCase(getOrganizations.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || null;
            })
            .addCase(
                createOrganization.fulfilled,
                (state, action: PayloadAction<Organization>) => {
                    state.createOrgStatus = "succeeded";
                    state.organizations.push(action.payload);
                }
            )
            .addCase(createOrganization.rejected, (state, action) => {
                state.createOrgStatus = "failed";
                state.error = action.payload || null;
            })
    }
})

export const {setCategory, setStatus, setCreateOrgStatus} = organizationsSlice.actions;

export default organizationsSlice.reducer