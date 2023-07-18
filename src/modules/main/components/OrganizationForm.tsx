import React, {FC, useState} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {useLoadScript} from "@react-google-maps/api";
import {Library} from "@googlemaps/js-api-loader";
import {useAppDispatch, useAppSelector} from "../../../store/types.ts";
import {Organization, OrganizationNew} from "../../../types/organization.type.ts";
import {withTimeout} from "../../../utils/withTimeout.ts";
import {createOrganization, setCreateOrgStatus} from "../../../store/slices/organizationsSlice.ts";
import PlacesAutocomplete from "./places-autocomplete/PlacesAutocomplete.tsx";
import Modal from "../../../components/modal/Modal.tsx";

export type OrganizationFormProps = {
    onClose: () => void,
    isActive: boolean,
    formData?: Organization
}

export type Location = {
    latitude: number,
    longitude: number
}

const libraries = ["places"]
const OrganizationForm: FC<OrganizationFormProps> = ({onClose, isActive, formData}) => {
        const {register, handleSubmit, formState: {errors}, setValue, reset} = useForm<OrganizationNew>();
        const {isLoaded} = useLoadScript({
            googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
            libraries: libraries as Library[],
        });
        const createOrgStatus = useAppSelector((state) => state.organizations.createOrgStatus);
        const dispatch = useAppDispatch();
        const [address, setAddress] = useState<Location | null>(null);

        const onSubmit: SubmitHandler<OrganizationNew> = async (data) => {
            dispatch(setCreateOrgStatus("loading"))
            withTimeout(async () => {
                try {
                    await dispatch(createOrganization({
                        ...data,
                        icon: data.icon![0],
                        ...address
                    })).unwrap()
                    onClose();

                } catch (e) {
                    return e;
                }
            })
        };

        return (
            <>
                {isLoaded &&
                    <Modal isActive={isActive} onClose={() => {
                        onClose()
                        reset()
                    }} title={formData ? "Редактирование организации" : "Создание организации"}>
                        <form onSubmit={handleSubmit(onSubmit)}
                              className='flex-col flex items-start justify-center text-blue-400 text-[14px] w-full'
                        >
                            <label>Название</label>
                            <input
                                type="text"
                                className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400'
                                {...register('title', {
                                    required: "Введите название"
                                })}
                            />
                            {errors?.title && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.title.message}</div>
                            )}
                            <label>Описание</label>
                            <input
                                type="text"
                                className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400'
                                {...register('description', {
                                    required: "Введите описание"
                                })}
                            />
                            {errors?.description && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.description.message}</div>
                            )}
                            <label>Изображение</label>
                            <input
                                type="file"
                                className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400'
                                {...register('icon', {
                                    required: "Добавьте изображение"
                                })}
                            />
                            {errors?.icon && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.icon.message}</div>
                            )}
                            <PlacesAutocomplete register={register}
                                                onSelected={(location: Location) => setAddress(location)}
                                                setFieldValue={setValue}
                            />
                            {errors?.address && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.address.message}</div>
                            )}
                            <label>Категория</label>
                            <input
                                type="text"
                                className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400'
                                {...register('category', {
                                    required: "Введите категорию"
                                })}
                            />
                            {errors?.category && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.category.message}</div>
                            )}
                            <button type="submit"
                                    disabled={createOrgStatus === "loading"}
                                    className='w-full bg-blue-400 rounded-md text-white py-2 mt-4 disabled: opacity-75'>{createOrgStatus === "loading" ? "Создание..." : "Создать"}
                            </button>
                        </form>
                    </Modal>
                }</>
        );
    }
;

export default OrganizationForm;