import {FC, useCallback, useEffect, useState} from "react";
import {Organization} from "../types/organization.type.ts";
import Modal from "../components/modal/Modal.tsx";
import {
    clearError,
    deleteOrg,
    deleteOrganization,
    getOrganizations,
    setStatus
} from "../store/slices/organizationsSlice.ts";
import {useAppDispatch, useAppSelector} from "../store/types.ts";
import {ellipsisLongText} from "../utils/ellipsisLongText.ts";
import {withTimeout} from "../utils/withTimeout.ts";
import OrganizationForm from "../modules/main/components/forms/OrganizationForm.tsx";
import Notification from "../components/Notification.tsx";

const Organizations: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const organizations = useAppSelector((state) => state.organizations.organizations);
    const status = useAppSelector((state) => state.organizations.status);
    const error = useAppSelector((state) => state.organizations.error);
    const currentCategory = useAppSelector(state => state.organizations.currentCategory);
    const deleteOrgStatus = useAppSelector((state) => state.organizations.deleteOrgStatus);
    const createUpdateOrganizationStatus = useAppSelector((state) => state.organizations.createUpdateOrganizationStatus);
    const [organizationToEdit, setOrganizationToEdit] = useState<Organization | null>(null);
    const [isNotificationActive, setIsNotificationActive] = useState<boolean>(false);

    const activateNotification = (trigger: boolean) => {
        if (trigger) {
            setIsNotificationActive(true);
            withTimeout(() => {
                setIsNotificationActive(false)
            }, 10000);
        }
    }

    useEffect(() => {
        activateNotification(deleteOrgStatus === "succeeded")
    }, [deleteOrgStatus])

    useEffect(() => {
        activateNotification(createUpdateOrganizationStatus === "succeeded")
    }, [createUpdateOrganizationStatus])

    const closeModal = useCallback(() => {
        setOrganizationToEdit(null);
        setIsModalOpen(false)
    }, [])

    const handleDeleteOrg = async (id: string) => {
        dispatch(clearError());
        await dispatch(deleteOrganization(id));
    }

    const handleEditOrganization = (organization: Organization) => {
        setOrganizationToEdit(organization);
        setIsModalOpen(true);
    }

    useEffect(() => {
        dispatch(setStatus("loading"));
        withTimeout(() => dispatch(getOrganizations()))
    }, [currentCategory])

    return (
        <>
            {error ? <Notification message={error} isActive={isNotificationActive} type={"error"} /> : null}
            <Notification message={"Данные об организациях успешно обновлены"} isActive={isNotificationActive} type={"success"} />
            <OrganizationForm isActive={isModalOpen}
                   onClose={closeModal} formData={organizationToEdit} />
            <div className='w-full flex flex-col p-4'>
                <div className='w-full bg-[#19181C] flex justify-between'>
                    <p className='h1-35-400'>Список организаций</p>
                    <button
                        className="w-[200px] h-[45px] rounded-[10px] h1-16-400 bg-[#2847A2] hover:bg-[#233D8B]"
                        onClick={
                            () => setIsModalOpen(true)
                        }
                    >
                        Добавить
                    </button>
                </div>
                <div className='flex w-full flex-wrap py-4 gap-4'>
                    {status === "loading" ? <p className=" text-2xl text-white">Загрузка...</p> : null}
                    {status === "failed" ?
                        <p className="text-[#FF0000] text-2xl">Ошибка при загрузке данных
                            пользователя</p> : null}
                    {status === "succeeded" ?

                        organizations.map((organization: Organization) =>
                            <div className='h-[450px] w-[350px] border-1 border-gray-600 border rounded-md mb-4 p-2 flex-col justify-between items-start flex'
                                 key={organization.id}>
                                <div className='min-h-[150px] w-full mb-4 bg-no-repeat bg-cover rounded-md'
                                     style={{backgroundImage: `url(${organization.icon})`}}>
                                </div>
                                <h1 className='h1-22-400 !text-blue-400 mb-4 w-full break-words max-w-[20ch] overflow-ellipsis'
                                    title={organization.title}>{organization.title}</h1>
                                <p className='text-[18px] h1-18-400 mb-4 w-full'
                                   title={organization.description}>{ellipsisLongText(
                                    organization.description,
                                    90
                                )}</p>
                                <p className='text-[16px] h1-16-400 mb-4 w-full'
                                   title={organization.address}>{ellipsisLongText(organization.address, 40)}</p>
                                <div className="flex justify-center gap-2 mt-3 w-full">
                                    <button className='bg-[#123094] hover:bg-[#121094] rounded-[12px] py-2 px-4 disabled:opacity-75'
                                            onClick={() => handleEditOrganization(organization)}><p
                                        className='h1-18-400'>Редактировать</p></button>
                                    <button className='bg-red-500 rounded-[12px] py-2 px-4 disabled:opacity-75'
                                            onClick={() => handleDeleteOrg(organization.id)}
                                            disabled={deleteOrgStatus === "loading"}
                                    ><p
                                        className='h1-18-400'>Удалить</p></button>
                                </div>
                            </div>
                        )
                        : null}
                </div>
            </div>
        </>

    )
}

export default Organizations;