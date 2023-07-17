import house from './static/house.svg'
import {logout} from "../../store/slices/authSlice.ts";
import {useAppDispatch} from "../../store/types.ts";
import {NavLink} from "react-router-dom";

const NavBar = () => {
    const dispatch = useAppDispatch();
    const handleLogout = () => {
        dispatch(logout());
    }

    return (
        <div className="h-[100vh] w-[250px] flex flex-col justify-between items-center bg-[#212021] pt-[20px] pb-[35px]">
            <div className="flex flex-col justify-start items-start w-full">
                <div className="flex w-full justify-center items-center mb-[50px]">
                    <h1 className="h1-30-400">LOGO</h1>
                </div>
                <div className="flex flex-col w-full">
                    <NavLink
                        to="/profile"
                        className={({isActive}) => {
                            const commonClass = "items-center cursor-pointer h1-18-400 px-4 py-1";
                            return isActive ? "bg-[#2847A2]  " + commonClass : commonClass;
                        }}
                    >
                        Профиль
                    </NavLink>
                    <NavLink
                        to="/"
                        className={({isActive}) => {
                            const commonClass = "items-center cursor-pointer h1-18-400 px-4 py-1";
                            return isActive ? "bg-[#2847A2]  " + commonClass : commonClass;
                        }}
                    >
                        Организации
                    </NavLink>
                    <NavLink
                        to="/users"
                        className={({isActive}) => {
                            const commonClass = "items-center cursor-pointer h1-18-400 px-4 py-1";
                            return isActive ? "bg-[#2847A2]  " + commonClass : commonClass;
                        }}
                    >
                        Пользователи
                    </NavLink>
                </div>
            </div>
            <div>
                <button className="w-[200px] h-[35px] rounded-[10px] h1-16-400 bg-red-500"
                        onClick={handleLogout}>Выйти
                </button>
            </div>
        </div>
    )
}

export default NavBar