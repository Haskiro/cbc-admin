import {useForm, SubmitHandler} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {clearError, login, setStatus} from "../../../store/slices/authSlice.ts";
import {useAppDispatch, useAppSelector} from "../../../store/types.ts";
import Notification from "../../../components/Notification.tsx";
import {withTimeout} from "../../../utils/withTimeout.ts";

interface AuthTypes {
    email: string,
    password: string,
}

const Autorization = () => {
    const {register, handleSubmit, formState: {errors}, reset} = useForm<AuthTypes>();
    const navigate = useNavigate()

    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);
    const status = useAppSelector((state) => state.auth.status);
    const error = useAppSelector(state => state.auth.error);
    const [isNotificationActive, setIsNotificationActive] = useState<boolean>(false);

    useEffect(() => {
        if (token) navigate("/");
    }, [token]);

    useEffect(() => {
        if (error) {
            setIsNotificationActive(true);
            withTimeout(() => {
                setIsNotificationActive(false)
            }, 10000);
        }
    }, [error])



    const onSubmit: SubmitHandler<AuthTypes> = async (data) => {
        try {
            dispatch(clearError());
            dispatch(setStatus("loading"))
            withTimeout(() => dispatch(login(data)).unwrap());
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        {error ? <Notification message={error} isActive={isNotificationActive} type={"error"} /> : null}
        <form onSubmit={handleSubmit(onSubmit)}
              className="w-full h-[100vh] bg-[#19181C] flex flex-col justify-center items-center">
            <h1 className="h1-30-400">LOGO</h1>
            <div className="flex flex-col justify-start items-start mt-[100px]">
                <div>
                    <h1 className="h1-18-400">Email</h1>
                    <input
                        type="text"
                        className="pl-[20px] w-[400px] h-[45px] rounded-[10px] bg-[#2B292E] outline-none h1-13-400"
                        placeholder="example@gmail.com"
                        {...register('email', {
                            required: "Введите Email",
                            pattern: {
                                value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                                message: "Введите корректный Email",
                            }
                        })}
                    />
                    {errors?.email && (
                        <div className="h1-11-400 !text-[#FE0826]">{errors.email.message}</div>
                    )}
                </div>
                <div className="mt-[25px] mb-[25px]">
                    <h1 className="h1-18-400">Пароль</h1>
                    <input
                        type="password"
                        className="pl-[20px] w-[400px] h-[45px] rounded-[10px] bg-[#2B292E] outline-none h1-13-400"
                        placeholder="******"
                        {...register('password', {
                            required: "Введите пароль",
                            minLength: {
                                value: 6,
                                message: "Пароль должен содержать более 5 символов",
                            }
                        })}
                    />
                    {errors?.password && (
                        <div className="h1-11-400 !text-[#FE0826]">{errors.password.message}</div>
                    )}
                </div>
                <button type="submit"
                        className="w-[400px] h-[45px] rounded-[10px] h1-16-400 bg-[#2847A2] hover:bg-[#233D8B] disabled:opacity-75"
                        disabled={status === "loading"}
                >{status === "loading" ? "Вход..." : "Войти"}
                </button>
            </div>
        </form>
        </>
    )
}

export default Autorization