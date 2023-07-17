import authReducer from "./slices/authSlice.ts";
import organizationsReducer from "./slices/organizationsSlice.ts";
import usersReducer from "./slices/usersSlice.ts";
import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    whitelist: [],
};

const authPersistConfig = {
    key: "auth",
    storage,
    blacklist: ["status", "user"],
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    organizations: organizationsReducer,
    users: usersReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    devTools: import.meta.env.DEV,
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
