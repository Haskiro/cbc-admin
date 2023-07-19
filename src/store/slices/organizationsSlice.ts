import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import api from "../../api"
import {Organization, OrganizationNew} from "../../types/organization.type.ts";
import {Status} from "../../types/status.type.ts";
import {createAppAsyncThunk} from "../types.ts";
import {Offer} from "../../types/offer.type.ts";
import {withTimeout} from "../../utils/withTimeout.ts";


export interface OrganizationsState {
    organizations: Organization[];
    status: Status;
    createUpdateOrganizationStatus: Status;
    deleteOrgStatus: Status;
    fetchOrganizationInfoStatus: Status;
    offerStatus: Status;
    error: string | null,
    categories: string[],
    categoriesStatus: Status,
    currentCategory: string,
    editingOrganization: Organization | null
}

const initialState: OrganizationsState = {
    organizations: [],
    status: "idle",
    createUpdateOrganizationStatus: "idle",
    deleteOrgStatus: "idle",
    fetchOrganizationInfoStatus: "idle",
    offerStatus: "idle",
    error: null,
    categories: [],
    categoriesStatus: "idle",
    currentCategory: "Все",
    editingOrganization: null
}

export const getOrganizations = createAppAsyncThunk(
    "organizations/getOrganizations",
    async (_, {getState}) => {
        const state = getState();
        const response = await api.organizations.getList(state.organizations.currentCategory);
        return response.map(org => ({
            ...org,
            icon: import.meta.env.VITE_API_URL + "/" + org.icon
        }));
    }
);

export const createOrganization = createAppAsyncThunk(
    "organizations/createOrganization",
    async (newOrg: Omit<OrganizationNew, "icon"> & {
        icon: File;
    }) => {
        const response = await api.organizations.createOrganization(newOrg);
        return response;
    }
);

export const deleteOrganization = createAppAsyncThunk(
    "organizations/deleteOrganization",
    async (id: string, {dispatch}) => {
        const response = await api.organizations.deleteOrganization(id);
        if (response.ok) {
            dispatch(deleteOrg(id));
        }
    }
);

export const editOrganization = createAppAsyncThunk(
    "organizations/editOrganization",
    async (org: Partial<Omit<OrganizationNew, "icon"> & {
        icon: File;
    }>, {dispatch}) => {
        const response = await api.organizations.editOrganization(org);
        if (response.ok) {
            dispatch(getOrganizations());
        }
    }
);

export const getOrganizationInfo = createAppAsyncThunk(
    "organizations/getOrganizationInfo",
    async (id: string, {dispatch}) => {
        const response = await api.organizations.getOrganizationById(id);
        return response;
    }
);

export const createOffer = createAppAsyncThunk(
    "organizations/createOffer",
    async (offer: Partial<Offer>,
           {dispatch}) => {
        const response = await api.organizations.createOffer(offer);
        if (response.text) {
            dispatch(setFetchOrganizationInfoStatus("loading"));
            withTimeout(() => dispatch(getOrganizationInfo(offer.organizationId as string)));
        }
        return response
    }
);

export const deleteOffer = createAppAsyncThunk(
    "organizations/deleteOffer",
    async (offer: Offer,
           {dispatch}) => {
        const response = await api.organizations.deleteOffer(offer.id);
        if (response.ok) {
            dispatch(setFetchOrganizationInfoStatus("loading"));
            withTimeout(() => dispatch(getOrganizationInfo(offer.organizationId as string)));
        }
        return response
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
            state.createUpdateOrganizationStatus = action.payload;
        },
        deleteOrg: (state, action: PayloadAction<string>) => {
            state.organizations.splice(state.organizations.findIndex(el => el.id === action.payload), 1);
        },
        updateOrg: (state, action: PayloadAction<Organization>) => {
            const existOrg = state.organizations.find(el => el.id === action.payload.id);
            const existOrgIndex = state.organizations.findIndex(el => el.id === action.payload.id);
            state.organizations[existOrgIndex] = {
                ...existOrg,
                ...action.payload
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        setFetchOrganizationInfoStatus: (state, action: PayloadAction<Status>) => {
            state.fetchOrganizationInfoStatus = action.payload;
        },
        setOfferStatus: (state, action: PayloadAction<Status>) => {
            state.offerStatus = action.payload;
        },
        setDeleteOrgStatus: (state, action: PayloadAction<Status>) => {
            state.deleteOrgStatus = action.payload;
        },
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
                state.error = action.error.message || null;
            })
            .addCase(
                createOrganization.fulfilled,
                (state, action: PayloadAction<Organization>) => {
                    state.createUpdateOrganizationStatus = "succeeded";
                    state.organizations.push({
                        ...action.payload,
                        icon: import.meta.env.VITE_API_URL + "/" + action.payload.icon
                    });
                }
            )
            .addCase(createOrganization.rejected, (state, action) => {
                state.createUpdateOrganizationStatus = "failed";
                state.error = action.error.message || null;
            })
            .addCase(
                deleteOrganization.pending,
                (state) => {
                    state.deleteOrgStatus = "loading";
                }
            )
            .addCase(
                deleteOrganization.fulfilled,
                (state) => {
                    state.deleteOrgStatus = "succeeded";
                }
            )
            .addCase(deleteOrganization.rejected, (state, action) => {
                state.deleteOrgStatus = "failed";
                state.error = action.error.message || null;
            })
            .addCase(
                editOrganization.fulfilled,
                (state) => {
                    state.createUpdateOrganizationStatus = "succeeded";
                }
            )
            .addCase(editOrganization.rejected, (state, action) => {
                state.createUpdateOrganizationStatus = "failed";
                state.error = action.error.message || null;
            })
            .addCase(
                getOrganizationInfo.fulfilled,
                (state, action: PayloadAction<Organization>) => {
                    state.editingOrganization = action.payload;
                    state.fetchOrganizationInfoStatus = "succeeded";
                }
            )
            .addCase(getOrganizationInfo.rejected, (state, action) => {
                state.fetchOrganizationInfoStatus = "failed";
                state.error = action.error.message || null;
            })
            .addCase(
                createOffer.fulfilled,
                (state) => {
                    state.offerStatus = "succeeded";
                }
            )
            .addCase(createOffer.rejected, (state, action) => {
                state.offerStatus = "failed";
                state.error = action.error.message || null;
            })
            .addCase(
                deleteOffer.fulfilled,
                (state) => {
                    state.offerStatus = "succeeded";
                }
            )
            .addCase(deleteOffer.rejected, (state, action) => {
                state.offerStatus = "failed";
                state.error = action.error.message || null;
            })
    }
})

export const {
    setCategory,
    setStatus,
    setCreateOrgStatus,
    deleteOrg,
    updateOrg,
    clearError,
    setFetchOrganizationInfoStatus,
    setOfferStatus,
    setDeleteOrgStatus
} = organizationsSlice.actions;

export default organizationsSlice.reducer