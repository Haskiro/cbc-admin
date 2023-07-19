import React, {FC, useEffect} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../../../../store/types.ts";
import {withTimeout} from "../../../../utils/withTimeout.ts";
import {Offer} from "../../../../types/offer.type.ts";
import {
    clearError, editOrganization,
    getOrganizationInfo,
    setFetchOrganizationInfoStatus
} from "../../../../store/slices/organizationsSlice.ts";


export type OfferForm = {
    onClose: () => void,
    organizationId: string
}

const OfferForm: FC<OfferForm> = React.memo(({onClose, organizationId}) => {
        const {register, handleSubmit, formState: {errors}, setValue, reset} = useForm<Partial<Offer>>();
        const fetchOrganizationInfoStatus = useAppSelector((state) => state.organizations.fetchOrganizationInfoStatus);
        const editingOrganization = useAppSelector((state) => state.organizations.editingOrganization);
        const dispatch = useAppDispatch();

        useEffect(() => {
            dispatch(clearError());
            dispatch(setFetchOrganizationInfoStatus("loading"));
            withTimeout(() => {
                dispatch(getOrganizationInfo(organizationId));
            })
            reset();
        }, [])

        const onSubmit: SubmitHandler<Partial<Offer>> = async (data) => {
            dispatch(clearError());
            withTimeout(async () => {
                try {
                    console.log({
                        ...data,
                        organizationId: organizationId
                    });
                    // await dispatch(changePassword(data));
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
                <h2 className="text-[16px] font-medium mt-4">Спец предложения</h2>
                {fetchOrganizationInfoStatus === "loading" ? <p>Загрузка спец предложений...</p> : null}
                {fetchOrganizationInfoStatus === "succeeded" && editingOrganization?.offers && editingOrganization.offers.length > 0 ?
                    <ul>
                        {editingOrganization.offers.map((offer) => <li className="flex gap-3" key={offer.id}>
                            <p className="rounded-md p-1 text-black border border-[#123094]">{offer.text}</p>
                            <button onClick={() => console.log("delete offer: ", offer.id)}
                                    className="text-red-500 text-[15px] hover:underline">Удалить
                            </button>
                        </li>)}
                    </ul> : null}
                {fetchOrganizationInfoStatus === "succeeded" && editingOrganization?.offers && editingOrganization.offers.length === 0 ?
                    <p>Нет ни одного спец предложения</p> : null}
                <h3 className="text-[15px] font-medium mt-3">Создать спец предложение</h3>
                <label>Текст</label>
                <input
                    type="text"
                    className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
                    {...register('text', {
                        required: "Введите текст",
                    })}
                />
                {errors?.text && (
                    <div className="h1-11-400 !text-[#FE0826]">{errors.text.message}</div>
                )}
                <button type="submit"
                        disabled={fetchOrganizationInfoStatus === "loading"}
                        className='w-full bg-[#123094] hover:bg-[#121094] rounded-md text-white py-2 mt-4 disabled: opacity-75'>{fetchOrganizationInfoStatus === "loading" ? "Сохранение..." : "Добавить"}
                </button>
            </form>
        );
    })
;

export default OfferForm;