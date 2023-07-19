import {FC, useCallback, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../store/types.ts";
import {withTimeout} from "../utils/withTimeout.ts";
import {blockCard, getUsers, setBlockCardStatus, setStatus} from "../store/slices/usersSlice.ts";
import {dateFormatter} from "../utils/dateFormatter.ts";
import UserForm from "../modules/main/components/forms/UserForm.tsx";
import {LoyaltyCard} from "../types/user.type.ts";

const Users: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.users.users);
    const status = useAppSelector((state) => state.users.status);
    const blockCardStatus = useAppSelector((state) => state.users.blockCardStatus);
    const closeModal = useCallback(() => {
        setIsModalOpen(false)
    }, [])

    useEffect(() => {
        dispatch(setStatus("loading"));
        withTimeout(() => dispatch(getUsers()))
    }, [])


    const handleBlockCard = async (card: LoyaltyCard) => {
        console.log("Block card")
        dispatch(setBlockCardStatus("loading"));
        dispatch(blockCard(card));
        withTimeout(() => dispatch(blockCard(card)));
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
                                    {user.email && user.email !== "user@fund.ru" ?
                                        <p>Почта: {user.email}</p> : null}
                                    <p>Дата
                                        регистрации: {dateFormatter(new Date(user.createdAt))}</p>
                                    {user.loyaltyCard ? <><p>Карта
                                        лояльности: {user.loyaltyCard.number}</p>
                                    </> : null}
                                    {user.loyaltyCard ? <>
                                        <div>Статус
                                            карты: {user.loyaltyCard.isBlocked ?
                                                <span className="text-red-500">Заблокирована</span> :
                                                <span className='text-green-500'>Активна</span>
                                            }
                                        </div>
                                    </> : null}
                                </div>
                                {user.loyaltyCard && !user.loyaltyCard.isBlocked ?
                                    <div className="flex justify-center gap-2 mt-3 w-full">
                                        <button className='bg-red-500 rounded-[12px] py-2 px-4 disabled:opacity-75'
                                                onClick={() => handleBlockCard(user.loyaltyCard as LoyaltyCard)}
                                            disabled={blockCardStatus === "loading"}
                                        ><p
                                            className='h1-16-400'>{blockCardStatus === "loading" ? "Блокирование" : "Заблокировать карту"}</p></button>
                                    </div> : null}
                            </div>
                        )
                        : null}
                </div>
            </div>
        </>

    )
}

export default Users;