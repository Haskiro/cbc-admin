import {FC, useEffect, useState} from 'react';
import NavBar from '../components/navbar/NavBar.tsx';
import {useAppSelector} from "../store";
import {Outlet, useNavigate} from "react-router-dom";

const MainLayout: FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate()
  useEffect(() => {
    if (!token) navigate('/auth');
  }, [token])


  return (
    <section>
      <div className='w-full flex flex-row ml-auto mr-10 bg-[#19181C]'>
        <NavBar/>
        <Outlet />
      </div>
    </section>
  );
};

export default MainLayout;
