import {FC, useCallback, useEffect, useState} from "react";
import {clearError, getUserInfo, setChangePasswordStatus, setStatus} from "../store/slices/authSlice.ts";
import {useAppDispatch, useAppSelector} from "../store/types.ts";
import {dateFormatter} from "../utils/dateFormatter.ts";
import {withTimeout} from "../utils/withTimeout.ts";
import {User} from "../types/user.type.ts";
import UserForm from "../modules/main/components/forms/UserForm.tsx";
import Notification from "../components/Notification.tsx";
import {setCreateUpdateUserStatus} from "../store/slices/usersSlice.ts";

const Profile: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const status = useAppSelector(state => state.auth.status)
    const changePasswordStatus = useAppSelector(state => state.auth.changePasswordStatus);
    const error = useAppSelector(state => state.auth.error)
    const createUpdateUserStatus = useAppSelector(state => state.users.createUpdateUserStatus)
    const [isNotificationActive, setIsNotificationActive] = useState<boolean>(false);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(false);

    const activateNotification = (trigger: boolean) => {
        if (trigger) {
            setIsNotificationActive(true);
            withTimeout(() => {
                setIsNotificationActive(false)
            }, 10000);
        }
    }

    useEffect(() => {
        dispatch(clearError());
        dispatch(setCreateUpdateUserStatus("idle"));
        dispatch(setChangePasswordStatus("idle"));
        dispatch(setStatus("loading"));
        withTimeout(() => dispatch(getUserInfo()));
    }, [])

    useEffect(() => {

        activateNotification(createUpdateUserStatus === "succeeded")
    }, [createUpdateUserStatus])

    useEffect(() => {
        activateNotification(changePasswordStatus === "succeeded")
    }, [changePasswordStatus])

    const handleEditUser = () => {
        setIsModalOpen(true);
    }

    const closeModal = useCallback(() => {
        setIsModalOpen(false)
    }, [])

    return (
        <>
            {error ? <Notification message={error} isActive={true} type={"error"}/> : null}
            <Notification message={"Данные о пользователе успешно обновлены"}
                          isActive={isNotificationActive}
                          type={"success"}/>
            <UserForm onClose={closeModal} isActive={isModalOpen} formData={user}/>
            <div className='w-full flex flex-col p-4'>
                <p className='h1-35-400'>Профиль</p>
                <div className="mt-3">
                    {status === "loading" ? <p className=" text-2xl text-white">Загрузка...</p> : null}
                    {status === "failed" ?
                        <p className="text-[#FF0000] text-2xl">Ошибка при загрузке данных
                            пользователя</p> : null}
                    {status === "succeeded" && user ? <div>
                        <div className="flex-col max-w-[400px] gap-1 p-4 rounded-xl bg-[#F6FBFF]">
                            <p className="text-[#123094] font-semibold text-[18px]">Имя: {user.firstName}</p>
                            <p className="text-[#123094] font-semibold text-[18px]">Фамилия: {user.lastName}</p>
                            <p className="text-[#123094] font-semibold text-[18px]">Почта: {user.email}</p>
                            <p className="text-[#123094] font-semibold text-[18px]">Дата
                                регистрации: {dateFormatter(new Date(user.createdAt))}</p>
                            <div className="flex justify-center gap-2 mt-3 w-full">
                                <button className='bg-[#123094] hover:bg-[#121094] rounded-[12px] py-2 px-4 disabled:opacity-75'
                                        onClick={handleEditUser}><p
                                    className='h1-18-400'>Редактировать</p></button>
                            </div>
                        </div>
                    </div> : null}
                </div>
            </div>
        </>

    )
}

export default Profile;