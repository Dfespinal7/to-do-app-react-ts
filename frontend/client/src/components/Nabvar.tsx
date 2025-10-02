import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Nabvar() {
    const navigate=useNavigate()
    const [openForm,setOpenForm]=useState<boolean>(false)
    const logout=async()=>{
        if(window.confirm('Desea cerrar Sesión?')){
            const result=await fetch('http://localhost:5000/logout',{
            method:'POST',
            credentials:'include'
        })
        if (result.ok){
            navigate('/login')
        }
        }
    }
    const handleForm=()=>{
        setOpenForm(!openForm)
    }
  return (
    <div className="">
        <nav className="bg-gray-200 h-12 flex items-center px-5 shadow-md justify-between">
            <div className=" w-[30%] flex justify-between">
                <button onClick={handleForm} className={openForm?"border px-2 py-1 rounded-lg border-sky-300 bg-sky-600 text-white font-medium hover:bg-gray-100 transition  cursor-pointer hover:text-sky-600":"border px-2 py-1 rounded-lg border-gray-300 bg-white text-gray-600 font-medium  hover:bg-gray-100 transition  cursor-pointer"}>{openForm?'Close form':'Add new task'}</button>
                <button className="border px-2 py-1 rounded-lg border-gray-300 bg-white text-gray-600 font-medium hover:bg-gray-100 transition cursor-pointer">Table view</button>
                <button className="border px-2 py-1 rounded-lg border-gray-300 bg-white text-gray-600 font-medium hover:bg-gray-100 transition cursor-pointer">Profile</button>
            </div>
            <button onClick={logout} className="border px-2 py-1 rounded-md border-red-500 bg-red-500 text-white font-bold cursor-pointer">Logout</button>
        </nav>
        <Outlet context={{openForm}}></Outlet>
    </div>
  )
}
