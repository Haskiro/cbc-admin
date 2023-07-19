import React, {FC, useEffect, useState} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {useLoadScript} from "@react-google-maps/api";
import {Library} from "@googlemaps/js-api-loader";
import {useAppDispatch, useAppSelector} from "../../../../store/types.ts";
import {Organization, OrganizationNew} from "../../../../types/organization.type.ts";
import {withTimeout} from "../../../../utils/withTimeout.ts";
import {
    clearError,
    createOrganization,
    editOrganization,
    setCreateOrgStatus
} from "../../../../store/slices/organizationsSlice.ts";
import PlacesAutocomplete from "../places-autocomplete/PlacesAutocomplete.tsx";
import Modal from "../../../../components/modal/Modal.tsx";
import OfferForm from "./OfferForm.tsx";

export type OrganizationFormProps = {
    onClose: () => void,
    isActive: boolean,
    formData: Organization | null
}

export type Location = {
    latitude: number,
    longitude: number
}

const libraries = ["places"]
const OrganizationForm: FC<OrganizationFormProps> = React.memo(({onClose, isActive, formData}) => {
        const {register, handleSubmit, formState: {errors}, setValue, reset} = useForm<OrganizationNew>({
            values: formData ? {
                title: formData.title,
                description: formData.description,
                address: formData.address,
                category: formData.category
            } as OrganizationNew : {
                title: "",
                description: "",
                address: "",
                category: ""
            } as OrganizationNew
        });
        const {isLoaded} = useLoadScript({
            googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
            libraries: libraries as Library[],
        });

        useEffect(() => {
            reset();
        }, [])
        const createUpdateOrganizationStatus = useAppSelector((state) => state.organizations.createUpdateOrganizationStatus);
        const dispatch = useAppDispatch();
        const [address, setAddress] = useState<Location | null>(formData ? {
            latitude: formData.latitude,
            longitude: formData.longitude
        } : null);

        const onSubmit: SubmitHandler<OrganizationNew> = async (data) => {
            dispatch(clearError());
            dispatch(setCreateOrgStatus("loading"))
            withTimeout(async () => {
                try {
                    if (!formData) {
                        await dispatch(createOrganization({
                            ...data,
                            icon: data.icon![0],
                            ...address
                        })).unwrap()
                    } else {
                        await dispatch(editOrganization({
                            id: formData.id,
                            title: data.title,
                            description: data.description,
                            address: data.address,
                            category: data.category,
                            ...address
                        })).unwrap()
                    }
                    onClose();
                    reset();

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
                              className='flex-col flex items-start justify-center text-[#123094] text-[14px] w-full'
                        >
                            <label>Название</label>
                            <input
                                type="text"
                                className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                                {...register('title', {
                                    required: "Введите название"
                                })}
                            />
                            {errors?.title && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.title.message}</div>
                            )}
                            <label>Описание</label>
                            <textarea
                                className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                                {...register('description', {
                                    required: "Введите описание"
                                })}
                            />
                            {errors?.description && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.description.message}</div>
                            )}
                            {!formData && <><label>Изображение</label>
                                <input
                                    type="file"
                                    className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                                    {...register('icon', {
                                        required: "Добавьте изображение"
                                    })}
                                />
                                {errors?.icon && (
                                    <div className="h1-11-400 !text-[#FE0826]">{errors.icon.message}</div>
                                )}</>}
                            <PlacesAutocomplete register={register}
                                                onSelected={(location: Location) => setAddress(location)}
                                                setFieldValue={setValue}
                                                defaultValue={formData ? formData.address : undefined}
                            />
                            {errors?.address && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.address.message}</div>
                            )}
                            <label>Категория</label>
                            <input
                                type="text"
                                className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                                {...register('category', {
                                    required: "Введите категорию"
                                })}
                            />
                            {errors?.category && (
                                <div className="h1-11-400 !text-[#FE0826]">{errors.category.message}</div>
                            )}
                            <button type="submit"
                                    disabled={createUpdateOrganizationStatus === "loading"}
                                    className='w-full bg-[#123094] hover:bg-[#121094] rounded-md text-white py-2 mt-4 disabled: opacity-75'>{createUpdateOrganizationStatus === "loading" ? "Сохранение..." : "Сохранить"}
                            </button>
                        </form>
                        {formData ? <OfferForm onClose={onClose} organizationId={formData.id} /> : null}
                    </Modal>
                }</>
        );
    })
;

export default OrganizationForm;