import React, {FC, useEffect} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../../../../store/types.ts";
import {withTimeout} from "../../../../utils/withTimeout.ts";
import {changePassword} from "../../../../store/slices/authSlice.ts";

export type ChangePasswordForm = {
    onClose: () => void,
}

const UserForm: FC<ChangePasswordForm> = React.memo(({onClose}) => {
        const {register, handleSubmit, formState: {errors}, setValue, reset} = useForm<{
            password: string,
            newPassword: string
        }>({
        });

        useEffect(() => {
            reset();
            dispatch(changePassword({password: "admin", newPassword: "admin"}));
        }, [])
        const changePasswordStatus = useAppSelector((state) => state.users.createUpdateUserStatus);
        const dispatch = useAppDispatch();

        const onSubmit: SubmitHandler<{
            password: string,
            newPassword: string
        }> = async (data) => {
            // dispatch(setCreateUpdateUserStatus("loading"))
            withTimeout(async () => {
                try {
                    console.log(data);
                    // onClose();
                    // reset();

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
                        type="text"
                        className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                        {...register('password', {
                            required: "Введите пароль"
                        })}
                    />
                    {errors?.password && (
                        <div className="h1-11-400 !text-[#FE0826]">{errors.password.message}</div>
                    )}
                    <label>Новый пароль</label>
                    <input
                        type="text"
                        className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                        {...register('newPassword', {
                            required: "Введите новый пароль"
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