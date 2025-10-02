import { useState } from "react"
import { type tasksProps } from "../pages/ListTasks"
import { ContextUse } from "../context/AutContext"


export default function FormTask() {
    const [addTask, setAddTask] = useState<tasksProps>({ title: '', status: '', priority: '', due_date: '' })
    const { tasks, setTasks, setAlert, setMessage } = ContextUse()

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name === 'due_date') {
            setAddTask({ ...addTask, [name]: value })
            console.log(value)
            return;
        }
        setAddTask({ ...addTask, [name]: value.toLocaleLowerCase() })

    }
    
    const formatDateToUTC=(dateString:string)=>{
            const date=new Date(dateString)
            console.log(date.toISOString())
            return date.toISOString()
        }
    const handleSubmitTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!addTask.title || !addTask.priority || !addTask.status || !addTask.due_date) {
            setAlert(true)
            setMessage({ message: 'debe ingresar todos los campos del formulario para crear la tarea', style: 'bg-red-200 w-120 text-red-500 p-1 rounded-lg mx-5' })
            console.log(addTask)
            setTimeout(() => {
                setAlert(false)
            }, 2000)
            return;
        }
        const result = await fetch('http://localhost:5000/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...addTask,due_date:formatDateToUTC(addTask.due_date)}),
            credentials: 'include'
        })
        const data = await result.json()
        if (!result.ok) {
            setAlert(true)
            setMessage({ message: data.message, style: 'bg-red-200 w-120 text-red-500 p-1 rounded-lg mx-5' })
            setTimeout(() => {
                setAlert(false)
            }, 2000)
            return;
        }
        const tempTask = {
            ...addTask,
            id: Date.now().toString(), 
        };
        

        setTasks([...tasks, tempTask])
        setAddTask({ title: '', status: '', priority: '', due_date: '' })
        console.log(data)
    }
    return (
        <div className="h-20">
            <form action="" onSubmit={(handleSubmitTask)} className=" flex gap-2 h-full  items-center justify-between px-8">
                <input onChange={handleChangeInput} value={addTask.title} name="title" type="text" placeholder="Enter Title" className="border px-2 py-1 rounded-md border-gray-300" />
                <div className="flex gap-2">
                    <label htmlFor="" className="text-gray-400 font-bold"> Select Status</label>
                    <select value={addTask.status} name="status" id="" onChange={handleChangeInput} className="border rounded-md border-gray-400 text-gray-400 px-2 py-1">
                        <option value="">Select</option>
                        <option value="inprogress">in Progress</option>
                        <option value="pending">Pending</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <label htmlFor="" className="text-gray-400 font-bold">Select Priority</label>
                    <select value={addTask.priority} name="priority" onChange={handleChangeInput} id="" className="border rounded-md border-gray-400 text-gray-400 px-2 py-1">
                        <option value="">Select</option>
                        <option value="higth">Higth</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <input value={addTask.due_date} onChange={handleChangeInput} name="due_date" type="date" placeholder="Date" className="border px-2 py-1 rounded-md border-gray-300" />
                <button className="bg-green-200 px-2 py-1 rounded-lg font-bold text-white cursor-pointer hover:bg-green-500">Add task</button>
                
            </form>
            
        </div>
    )
}
