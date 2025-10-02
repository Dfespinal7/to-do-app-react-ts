import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { type tasksProps } from "../pages/ListTasks";
import type { Dispatch, SetStateAction } from 'react';
type LoginProps = {
    email?: string
    password?: string
}
type ContextProps = {
    userLogin: LoginProps | undefined
    login: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmitLogin?: (e: React.FormEvent<HTMLFormElement>) => void
    message?: messageProps | undefined
    alert: boolean,
    tasks:tasksProps[] | any[]
    setTasks:Dispatch<SetStateAction<tasksProps[] | any[]>>
    setAlert:Dispatch<SetStateAction<boolean>>
    setMessage:Dispatch<SetStateAction<messageProps|undefined>>
}

type ChildrenProps = {
    children: ReactNode
}
type messageProps = {
    message: string
    style: string
}

export const AuthContext = createContext<ContextProps | undefined>(undefined)

export const ContextUse = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('No hay contexto')
    return context
}


export default function AuthComponent({ children }: ChildrenProps) {
    const [userLogin, setUserLogin] = useState<LoginProps | undefined>({ email: '', password: '' })
    const [message, setMessage] = useState<messageProps | undefined>({ message: '', style: '' })
    const [alert, setAlert] = useState<boolean>(false)
    const [tasks, setTasks] = useState<tasksProps[] | any[]>([])

    const navigate = useNavigate()

    const login = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUserLogin({ ...userLogin, [e.target.name]: e.target.value })
        }
        catch (e) {
            console.log(e)
        }
    }
    const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const result = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userLogin),
                credentials: 'include'
            })
            const data = await result.json()
            if (result.status !== 200) {
                setAlert(true)
                setMessage({ message: data.message, style: 'bg-red-100 px-2 py-1 rounded-md text-red-500 border' })
                setUserLogin({ email: '', password: '' })
                setTimeout(() => {
                    setAlert(false)
                }, 2000);
                return;
            }
            setAlert(true)
            setMessage({ message: data.message, style: 'bg-green-100 px-2 py-1 rounded-md text-green-500 border' })
            setUserLogin({ email: '', password: '' })
            setTimeout(() => {
                setAlert(false)
                navigate('/')
            }, 2000)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <AuthContext.Provider value={{ userLogin, login, handleSubmitLogin, message, alert,tasks,setTasks,setAlert,setMessage }}>
            {children}
        </AuthContext.Provider>
    )
}