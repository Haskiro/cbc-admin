import {FC, useEffect} from "react";
import {getUserInfo, setStatus} from "../store/slices/authSlice.ts";
import {useAppDispatch, useAppSelector} from "../store/types.ts";
import {dateFormatter} from "../utils/dateFormatter.ts";
import {withTimeout} from "../utils/withTimeout.ts";

const Organizations: FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const status = useAppSelector(state => state.auth.status)

    useEffect(() => {
        dispatch(setStatus("loading"));
        withTimeout(() => dispatch(getUserInfo()))
    }, [])

    return (
        <>

            <div className='w-full flex flex-col p-4'>
                <p className='h1-35-400'>Профиль</p>
                <div className="mt-3">
                    {status === "loading" ? <p className=" text-2xl text-white">Загрузка...</p> : null}
                    {status === "failed" ?
                        <p className="text-[#FF0000] text-2xl">Ошибка при загрузке данных
                            пользователя</p> : null}
                    {status === "succeeded" && user ? <div>
                        <div className="flex-col max-w-[400px] gap-1 p-4 rounded-xl bg-[#F6FBFF]">
                            <p className="text-[#04764E] font-semibold text-[18px]">Имя: {user.firstName}</p>
                            <p className="text-[#04764E] font-semibold text-[18px]">Фамилия: {user.lastName}</p>
                            <p className="text-[#04764E] font-semibold text-[18px]">Почта: {user.email}</p>
                            <p className="text-[#04764E] font-semibold text-[18px]">Дата
                                регистрации: {dateFormatter(new Date(user.createdAt))}</p>
                        </div>
                    </div> : null}
                </div>
            </div>
        </>

    )
}

export default Organizations;