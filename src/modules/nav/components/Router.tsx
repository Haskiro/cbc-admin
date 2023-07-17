import {Route, Routes} from "react-router-dom"
import Auth from "../../../pages/Auth.tsx"
import Main from "../../../pages/Main"
const Router = () => {
  return (
    <Routes>
        <Route path="/" element={<Auth/>}></Route>
        <Route path="/main" element={<Main/>}></Route>
    </Routes>
  )
}

export default Router