import {Route, Routes} from "react-router-dom"
import Auth from "../../../pages/Auth.tsx"
import MainLayout from "../../../pages/MainLayout.tsx"
const Router = () => {
  return (
    <Routes>
        <Route path="/" element={<Auth/>}></Route>
        <Route path="/main" element={<MainLayout/>}></Route>
    </Routes>
  )
}

export default Router