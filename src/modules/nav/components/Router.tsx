import {Route, Routes} from "react-router-dom"
import Autn from "../../../pages/Autn"
import Main from "../../../pages/Main"
const Router = () => {
  return (
    <Routes>
        <Route path="/" element={<Autn/>}></Route>
        <Route path="/main" element={<Main/>}></Route>
    </Routes>
  )
}

export default Router