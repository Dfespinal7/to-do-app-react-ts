import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import AuthComponent from "./context/AutContext"
import ListTasks from "./pages/ListTasks"
import Nabvar from "./components/Nabvar"
import ProtectedRoute from "./components/ProtectedRoute"
import RegisterPage from "./pages/RegisterPage"




function App() {


  return (
    <>

      <BrowserRouter>
        <AuthComponent>
          <Routes>
            <Route path="/login" element={<LoginPage></LoginPage>}></Route>
            <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
            <Route element={<Nabvar></Nabvar>}>
            <Route path="/" element={<ProtectedRoute><ListTasks></ListTasks></ProtectedRoute>}></Route>
            </Route>
          </Routes>
        </AuthComponent>
      </BrowserRouter>


    </>
  )
}

export default App
//2:10