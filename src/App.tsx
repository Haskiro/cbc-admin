import { BrowserRouter } from "react-router-dom"
import {Routes, Route} from "react-router-dom"
import Auth from "./pages/Auth"
import Main from "./pages/Main"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth/>}></Route>
        <Route path="/main" element={<Main/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
