import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { ContextUse } from "../context/AutContext";

type RegisterProps = {
  name?: string
  email?: string
  password?: string
}
export default function RegisterPage() {
  const [userRegister, setUserRegister] = useState<RegisterProps | undefined>(undefined)
  const { alert, setAlert, message, setMessage } = ContextUse()
  const navigate=useNavigate()
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserRegister({ ...userRegister, [name]: value })
  }

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userRegister),
      credentials: 'include'
    })
    const data = await result.json()
    if (!result.ok) {
      setAlert(true)
      setMessage({ message: data.message, style: 'bg-red-200 px-2 py-1 my-2 rounded-lg text-red-500' })
      setTimeout(() => {
        setAlert(false)
      }, 2000)
      return;
    }
    setAlert(true)
    setMessage({ message: data.message, style: 'bg-green-200 px-2 py-1 my-2 rounded-lg text-green-500' })
    setTimeout(() => {
      setAlert(false)
      navigate('/')
    }, 2000)
  }
  return (
    <div className="bg-gray-100 h-screen flex flex-col items-center py-15">
      {
        alert && (
          <p className={message?.style}>{message?.message}</p>
        )
      }
      <div className="border p-5 w-80 h-60 rounded-lg border-gray-500 shadow-lg bg-white flex flex-col gap-2">

        <h1 className="text-2xl font-bold text-gray-400">Register</h1>
        <form onSubmit={handleSubmitRegister} action="" className="flex flex-col  w-full h-full justify-between ">
          <input onChange={handleChangeInput} name="name" type="text" placeholder="Enter your name" className="border rounded-lg px-2 py-1 shadow-lg border-gray-400" />
          <input onChange={handleChangeInput} name="email" type="text" placeholder="Enter your email" className="border rounded-lg px-2 py-1 shadow-lg border-gray-400" />
          <input onChange={handleChangeInput} name="password" type="text" placeholder="Enter your password" className="border rounded-lg px-2 py-1 shadow-lg border-gray-400" />
          <button className=" rounded-md bg-blue-300 font-bold text-white px-2 py-1 cursor-pointer hover:bg-blue-700">Register</button>
        </form>
      </div>
      <p>Already have an Account? <Link to={'/login'} className="text-blue-400">Click on here</Link></p>
    </div>
  )
}
