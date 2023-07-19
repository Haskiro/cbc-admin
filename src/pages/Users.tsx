import {FC, useCallback, useEffect, useState} from "react";
import {Organization} from "../types/organization.type.ts";
import Modal from "../components/modal/Modal.tsx";
import {useAppDispatch, useAppSelector} from "../store/types.ts";
import {ellipsisLongText} from "../utils/ellipsisLongText.ts";
import {withTimeout} from "../utils/withTimeout.ts";
import {getUsers, setStatus} from "../store/slices/usersSlice.ts";
import {dateFormatter} from "../utils/dateFormatter.ts";
import UserForm from "../modules/main/components/forms/UserForm.tsx";
import {User} from "../types/user.type.ts";
import {deleteOrganization} from "../store/slices/organizationsSlice.ts";

const Users: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.users.users);
    const status = useAppSelector((state) => state.users.status);

    const closeModal = useCallback(() => {
        setIsModalOpen(false)
    }, [])

    useEffect(() => {
        dispatch(setStatus("loading"));
        withTimeout(() => dispatch(getUsers()))
    }, [])

    const handleDeleteUser = async (id: string) => {
        console.log("user to delete: " + id);
        // await dispatch(deleteOrganization(id));
    }

    return (
        <>
            <UserForm onClose={closeModal} isActive={isModalOpen} formData={null}/>
            <div className='w-full flex flex-col p-4'>
                <div className='w-full bg-[#19181C] flex justify-between'>
                    <p className='h1-35-400'>Список пользователей</p>
                    <button
                        className="w-[200px] h-[45px] rounded-[10px] h1-16-400 bg-[#2847A2] hover:bg-[#233D8B]"
                        onClick={
                            () => setIsModalOpen(true)
                        }
                    >
                        Создать нового
                    </button>
                </div>
                <div className='flex w-full flex-wrap py-4 gap-4'>
                    {status === "loading" ? <p className=" text-2xl text-white">Загрузка...</p> : null}
                    {status === "failed" ?
                        <p className="text-[#FF0000] text-2xl">Ошибка при загрузке данных</p> : null}
                    {status === "succeeded" ?

                        users.map((user) =>
                            <div className='w-[280px] flex flex-col justify-between  p-4 rounded-xl bg-[#F6FBFF]'
                                 key={user.id}>
                                <div className="flex flex-col gap-1 text-[#123094] font-semibold text-[16px]">
                                    <p>Имя: {user.firstName}</p>
                                    <p>Фамилия: {user.lastName}</p>
                                    {user.email !== "user@fund.ru" ?
                                        <p>Почта: {user.email}</p> : null}
                                    <p>Дата
                                        регистрации: {dateFormatter(new Date(user.createdAt))}</p>
                                    {user.loyaltyCard ? <><p>Карта
                                        лояльности: {user.loyaltyCard.number}</p>
                                    </> : null}
                                    {/*{user.isConfirmed ? <p className='font-semibold text-[18px] text-green-500'>Подтвержден</p> : <p className='font-semibold text-[18px] text-red-500'>Не подтвержден</p>}*/}
                                </div>
                                <div className="flex justify-center gap-2 mt-3">
                                    <button className='bg-red-500 rounded-[12px] py-2 px-4 disabled:opacity-75'
                                            onClick={() => handleDeleteUser(user.id)}
                                        // disabled={deleteOrgStatus === "loading"}
                                    ><p
                                        className='h1-16-400'>Удалить</p></button>
                                </div>
                            </div>
                        )
                        : null}
                </div>
            </div>
        </>

    )
}

export default Users;