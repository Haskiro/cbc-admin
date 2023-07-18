import {FC, useEffect, useState} from "react";
import {Organization} from "../types/organization.type.ts";
import Modal from "../components/modal/Modal.tsx";
import {useAppDispatch, useAppSelector} from "../store/types.ts";
import {ellipsisLongText} from "../utils/ellipsisLongText.ts";
import {withTimeout} from "../utils/withTimeout.ts";
import {getUsers, setStatus} from "../store/slices/usersSlice.ts";
import {dateFormatter} from "../utils/dateFormatter.ts";

const Users: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.users.users);
    const status = useAppSelector((state) => state.users.status);
    const closeModal = () => setIsModalOpen(false)

    useEffect(() => {
        dispatch(setStatus("loading"));
        withTimeout(() => dispatch(getUsers()))
    }, [])

    return (
        <>
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
                            <div className='w-[350px] flex-col gap-1 p-4 rounded-xl bg-[#F6FBFF]'
                                 key={user.id}>
                                <p className="text-[#04764E] font-semibold text-[18px]">Имя: {user.firstName}</p>
                                <p className="text-[#04764E] font-semibold text-[18px]">Фамилия: {user.lastName}</p>
                                <p className="text-[#04764E] font-semibold text-[18px]">Почта: {user.email}</p>
                                <p className="text-[#04764E] font-semibold text-[18px]">Дата
                                    регистрации: {dateFormatter(new Date(user.createdAt))}</p>
                                {user.loyaltyCard ? <><p className="text-[#04764E] font-semibold text-[18px]">Карта лояльности: {user.loyaltyCard.number}</p>
                                    </> : null}
                                {user.isConfirmed ? <p className='font-semibold text-[18px] text-green-500'>Подтвержден</p> : <p className='font-semibold text-[18px] text-red-500'>Не подтвержден</p>}
                                <div className="flex justify-center gap-2 mt-3">
                                    <button className='bg-orange-500 rounded-[12px] py-2 px-4'
                                            onClick={() => console.log("user to delete: " + user.id)}><p
                                        className='h1-18-400'>Редактировать</p></button>
                                    <button className='bg-red-500 rounded-[12px] py-2 px-4'
                                            onClick={() => console.log("user to delete: " + user.id)}><p
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

export default Users;