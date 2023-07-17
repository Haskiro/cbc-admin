import { BrowserRouter } from "react-router-dom"
import {Routes, Route} from "react-router-dom"
import Auth from "./pages/Auth"
import MainLayout from "./pages/MainLayout.tsx"
import Organizations from "./pages/Organizations.tsx";
import Profile from "./pages/Profile.tsx";
import Users from "./pages/Users.tsx";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth/>} />
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<Organizations />} />
          <Route path="profile" element={<Profile />} />
          <Route path="users" element={<Users />} />
        </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
