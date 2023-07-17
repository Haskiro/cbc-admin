import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "./index.ts";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: AppDispatch
    rejectValue: string
}>();

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;