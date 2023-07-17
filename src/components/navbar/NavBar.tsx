import house from './static/house.svg'
import {useAppDispatch} from "../../store";
import {logout} from "../../store/slices/authSlice.ts";

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
            <div className="flex flex-col pl-[15px]">
                <div className="flex flex-row justify-start items-center cursor-pointer">
                    <img src={house} alt="icon" className="w-[25px] h-[25px] mr-[10px]"/>
                    <h1 className="h1-18-400">Организации</h1>
                </div>
                <div className="flex flex-row justify-start items-center mt-[20px] cursor-pointer">
                    <img src={house} alt="icon" className="w-[25px] h-[25px] mr-[10px]"/>
                    <h1 className="h1-18-400">Пользоваетели</h1>
                </div>
            </div>
        </div>
        <div>
            <button className="w-[200px] h-[35px] rounded-[10px] h1-16-400 bg-[#2847A2] hover:bg-[#233D8B]" onClick={handleLogout}>Выйти</button>
        </div>
    </div>
  )
}

export default NavBar