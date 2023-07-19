import React, {FC, useEffect} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../../../../store/types.ts";
import {withTimeout} from "../../../../utils/withTimeout.ts";
import {changePassword, clearError, setChangePasswordStatus} from "../../../../store/slices/authSlice.ts";

export type ChangePasswordForm = {
    onClose: () => void,
}

const UserForm: FC<ChangePasswordForm> = React.memo(({onClose}) => {
        const {register, handleSubmit, formState: {errors}, setValue, reset} = useForm<{
            password: string,
            newPassword: string
        }>({});
        const changePasswordStatus = useAppSelector((state) => state.auth.changePasswordStatus);
        const dispatch = useAppDispatch();

        useEffect(() => {
            reset();
        }, [])

        const onSubmit: SubmitHandler<{
            password: string,
            newPassword: string
        }> = async (data) => {
            dispatch(clearError());
            dispatch(setChangePasswordStatus("loading"))
            withTimeout(async () => {
                try {
                    await dispatch(changePassword(data));
                    reset();
                } catch (e) {
                    return e;
                }
            })
        };

        return (
            <form onSubmit={handleSubmit(onSubmit)}
                  className='flex-col flex items-start justify-center text-[#123094] text-[14px] w-full'
            >
                <h2 className="text-[16px] font-medium mt-4">Смена пароля</h2>
                <label>Пароль</label>
                <input
                    type="password"
                    className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                    {...register('password', {
                        required: "Введите пароль",
                        minLength: {
                            value: 6,
                            message: "Минимальная длина 6 символов"
                        }
                    })}
                />
                {errors?.password && (
                    <div className="h1-11-400 !text-[#FE0826]">{errors.password.message}</div>
                )}
                <label>Новый пароль</label>
                <input
                    type="password"
                    className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                    {...register('newPassword', {
                        required: "Введите новый пароль",
                        minLength: {
                            value: 6,
                            message: "Минимальная длина 6 символов"
                        }
                    })}
                />
                {errors?.newPassword && (
                    <div className="h1-11-400 !text-[#FE0826]">{errors.newPassword.message}</div>
                )}
                <button type="submit"
                        disabled={changePasswordStatus === "loading"}
                        className='w-full bg-[#123094] hover:bg-[#121094] rounded-md text-white py-2 mt-4 disabled: opacity-75'>{changePasswordStatus === "loading" ? "Сохранение..." : "Сохранить"}
                </button>
            </form>
        );
    })
;

export default UserForm;