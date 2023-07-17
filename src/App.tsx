import { BrowserRouter } from "react-router-dom"
import {Routes, Route} from "react-router-dom"
import Autn from "./pages/Autn"
import Main from "./pages/Main"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Autn/>}></Route>
        <Route path="/main" element={<Main/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
