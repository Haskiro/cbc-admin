import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "./index.ts";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {CustomError} from "../types/customError.ts";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: AppDispatch
    rejectValue: CustomError
}>();

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;