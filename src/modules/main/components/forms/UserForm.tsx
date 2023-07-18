import React, {FC, useEffect} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../../../../store/types.ts";
import Modal from "../../../../components/modal/Modal.tsx";
import {User} from "../../../../types/user.type.ts";

export type UserFormProps = {
    onClose: () => void,
    isActive: boolean,
    formData: User | null
}

const UserForm: FC<UserFormProps> = React.memo(({onClose, isActive, formData}) => {
        const {register, handleSubmit, formState: {errors}, setValue, reset} = useForm<User>({
            values: formData ? {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            } as User : {
                firstName: "",
                lastName: "",
                email: ""
            } as User
        });

        useEffect(() => {
            reset();
        }, [])
        const createUpdateOrganizationStatus = useAppSelector((state) => state.organizations.createUpdateOrganizationStatus);
        const dispatch = useAppDispatch();

        const onSubmit: SubmitHandler<User> = async (data) => {
            console.log(data);
            // dispatch(setCreateOrgStatus("loading"))
            // withTimeout(async () => {
            //     try {
            //         if (!formData) {
            //
            //         } else {
            //
            //         }
            //         onClose();
            //         reset();
            //
            //     } catch (e) {
            //         return e;
            //     }
            // })
        };

        return (
                    <Modal isActive={isActive} onClose={() => {
                        onClose()
                        reset()
                    }} title={formData ? "Редактирование пользователя" : "Создание пользователя"}>
                        <form onSubmit={handleSubmit(onSubmit)}
                              className='flex-col flex items-start justify-center text-[#123094] text-[14px] w-full'
                        >
                            <label>Имя</label>
                            <input
                                type="text"
                                className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                                {...register('firstName', {
                                    required: "Введите имя"
                                })}
                            />
                            {errors?.firstName && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.firstName.message}</div>
                            )}
                            <label>Фамилия</label>
                            <input
                                type="text"
                                className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                                {...register('lastName', {
                                    required: "Введите фамилию"
                                })}
                            />
                            {errors?.lastName && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.lastName.message}</div>
                            )}<label>Почта</label>
                            <input
                                type="text"
                                className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                                {...register('email', {
                                    required: "Введите почту",
                                    pattern: {
                                        value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                                        message: "Введите корректный Email",
                                    }
                                })}
                            />
                            {errors?.email && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.email.message}</div>
                            )}
                            <button type="submit"
                                    disabled={createUpdateOrganizationStatus === "loading"}
                                    className='w-full bg-[#123094] hover:bg-[#121094] rounded-md text-white py-2 mt-4 disabled: opacity-75'>{createUpdateOrganizationStatus === "loading" ? "Сохранение..." : "Сохранить"}
                            </button>
                        </form>
                    </Modal>
        );
    })
;

export default UserForm;