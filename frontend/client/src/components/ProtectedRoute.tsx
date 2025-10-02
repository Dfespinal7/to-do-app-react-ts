import { type ReactNode,useEffect } from "react"
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
type ProtectedRouteProps={
    children:ReactNode
}
export default function ProtectedRoute({children}:ProtectedRouteProps) {
    const navigate=useNavigate()
    const token=Cookies.get('token')
     useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
   if(!token)return null
   return <>{children}</>
}
