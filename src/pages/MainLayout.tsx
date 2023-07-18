import {FC, useEffect} from 'react';
import NavBar from '../components/navbar/NavBar.tsx';
import {Outlet, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store/types.ts";
import {HTTP} from "../api";
import {resetToken} from "../store/slices/authSlice.ts";

const MainLayout: FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!token) navigate('/auth')
    HTTP.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    HTTP.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      if (error.response.status === 401) {
        dispatch(resetToken())
      }
      return Promise.reject(error);
    });
  }, [token])


  return (
    <section>
      <div className='w-full max-h-[100vh] flex flex-row ml-auto mr-10 bg-[#19181C]'>
        <NavBar/>
        <div className="overflow-y-auto w-full">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default MainLayout;
