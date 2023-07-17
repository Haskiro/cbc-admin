import {useForm, SubmitHandler} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {login} from "../../../store/slices/authSlice.ts";
import {useAppDispatch, useAppSelector} from "../../../store/types.ts";

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

    useEffect(() => {
        if (token) navigate("/");
    }, [token]);

    const onSubmit: SubmitHandler<AuthTypes> = async (data) => {
        try {
            await dispatch(login(data)).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    return (
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
                <button type="submit" className="w-[400px] h-[45px] rounded-[10px] h1-16-400 bg-[#2847A2] hover:bg-[#233D8B]">Войти</button>
            </div>
        </form>
    )
}

export default Autorization