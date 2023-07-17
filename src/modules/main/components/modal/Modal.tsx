import React, {FC, useState} from 'react';
import cl from './Modal.module.css'
import classNames from 'classnames';
import {Organization, OrganizationNew} from "../../../../types/organization.type.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {useLoadScript} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import PlacesAutocomplete from "../places-autocomplete/PlacesAutocomplete.tsx";

export type ModalProps = {
    isActive: boolean
    onClose: () => void,
    createPost: any,
    postList: Organization[]
}

const Modal: FC<ModalProps> = ({isActive, onClose, createPost, postList}) => {
        const {register, handleSubmit, formState: {errors}, reset} = useForm<OrganizationNew>();
        const {isLoaded} = useLoadScript({
            googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
            libraries: ["places"],
        });
        const [address, setAddress] = useState<string>("");

        const onSubmit: SubmitHandler<OrganizationNew> = async (data) => {
            try {
                // await dispatch(login(data)).unwrap();
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        };

        return (
            <>
                {isLoaded &&
                    <div className={classNames(`${cl.modal} ${isActive && cl.active}`)}
                         onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                             onClose()
                         }}>
                        <div className='py-6 px-4 bg-white rounded-md w-[500px] relative flex items-center justify-center flex-col'
                             onClick={(e) => e.stopPropagation()}>
                            <button className='absolute right-[10px] top-[10px] text-[12px]'
                                    onClick={onClose}>Закрыть
                            </button>
                            <h1 className='text-blue-400 text-[24px]'>Создание организации</h1>
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
                                <PlacesAutocomplete register={register} onSelected={setAddress} />
                                {errors?.address && (
                                    <div className="h1-11-400 !text-[#FE0826]">{errors.address.message}</div>
                                )}
                                <button type="submit"
                                        className='w-full bg-blue-400 rounded-md text-white py-2 mt-4'>Создать
                                </button>
                            </form>
                        </div>
                    </div>}</>
        );
    }
;

export default Modal;