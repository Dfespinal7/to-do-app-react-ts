import { useEffect } from "react"
import { useOutletContext } from "react-router-dom";
import FormTask from "../components/FormTask";
import { ContextUse } from "../context/AutContext";
export type tasksProps = {
    id?: number,
    title: string
    status: string
    priority: string
    due_date: string
    user_id?: number
}
export default function ListTasks() {
    //const [tasks, setTasks] = useState<tasksProps[] | any[]>([])
    const { tasks, setTasks, alert, setAlert, message, setMessage } = ContextUse()
    const { openForm } = useOutletContext<{ openForm: boolean }>();


    const getAllTasks = async () => {
        try {
            const result = await fetch('http://localhost:5000/mytasks', {
                credentials: 'include'
            })
            const data = await result.json()
            setTasks(data)
        } catch (e) {
            console.log(e)
        }
    }
    const handleStatus = async (status: string, id: number) => {
        try {
            const taskToUpdate = tasks.find(t => t.id === id)
            const newTaskUpdate = { ...taskToUpdate, status: status.toLocaleLowerCase() }

            const result = await fetch(`http://localhost:5000/task/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTaskUpdate),
                credentials: 'include'
            })
            const data = await result.json()
            if (result.status != 200) {
                setAlert(true)
                setMessage({ message: data.message, style: 'bg-red-200 w-120 text-red-500 p-1 rounded-lg mx-5' })
                setTimeout(() => {
                    setAlert(false)
                }, 2000)
                return;
            }
            setTasks(tasks.map(t => t.id === id ? { ...t, status: status } : t))

            getAllTasks()
        } catch (e) {
            console.log(e)
        }
    }
    const deleteTask = async (id: number) => {
        try {
            if (window.confirm('Are you sure you want to delete this task?')) {
                const result = await fetch(`http://localhost:5000/task/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
                const data = await result.json()
                console.log(data)
                setTasks(tasks.filter(t => t.id !== id))
            }
        } catch (e) {
            console.log(e)
        }

    }
    const formatDate=(date:string)=>{
        let value=''
        for(let i=0;i<10;i++){
            value=value+date[i]    
        }
        return value
    }
    useEffect(() => {
        getAllTasks()
    }, [])
    return (
        <div>
            {
                openForm && (
                    <FormTask></FormTask>
                )
            }
            {
                        alert && (
                            <p className={message?.style}>{message?.message}</p>
                        )
                    }
            <div className=" h-screen bg-gray-100 grid grid-cols-3 gap-2 p-2">
            
                <div className="p-2 flex flex-col gap-2">
                    
                    <div className="border h-10 flex justify-center items-center gap-2 rounded-md border-gray-300"><h1 className="text-2xl font-bold text-gray-400">In progress</h1></div>
                    {
                        tasks.filter(t => t.status === 'inprogress').map(task => (
                            <div key={task.id} className=" rounded-md  bg-green-200 p-3 flex flex-col items-center cursor-pointer hover:scale-102">
                                <div className="flex  w-full justify-between px-2">
                                    <h1 className="text-xl font-bold">{task.title}</h1>
                                    <p className="font-semibold">{task.priority}</p>
                                </div>
                                <div className="p-1 w-full flex justify-between px-2">
                                    {['inprogress', 'Pending', 'Done'].map(status => (
                                        <button onClick={() => handleStatus(status, task.id)}
                                            key={status}
                                            className={`px-2 py-1 rounded-md text-sm font-medium transition-all cursor-pointer hover:scale-101 ${task.status.toLowerCase() === status.toLowerCase()
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            {status === 'inprogress' ? 'In Progress' : status}
                                        </button>
                                    ))}
                                </div>
                                <div className=" w-full flex justify-between">
                                    <p className="text-sm font-extralight">{formatDate(task.due_date)}</p>
                                    <button onClick={() => deleteTask(task.id)} className="bg-red-400 rounded-lg px-2 py font-bold text-white cursor-pointer hover:bg-red-500">Delete task</button>
                                </div>

                            </div>
                        ))
                    }
                </div>
                <div className=" p-2 flex flex-col gap-2">
                    <div className="border h-10 flex justify-center items-center gap-2 rounded-md border-gray-300"><h1 className="text-2xl font-bold text-gray-400">Pending</h1></div>
                    {
                        tasks.filter(t => t.status === 'pending').map(task => (
                            <div key={task.id} className=" rounded-md  bg-blue-200 p-3 flex flex-col items-center cursor-pointer hover:scale-102">
                                <div className="flex  w-full justify-between px-2">
                                    <h1 className="text-xl font-bold">{task.title}</h1>
                                    <p className="font-semibold">{task.priority}</p>
                                </div>
                                <div className="p-1 w-full flex justify-between px-2">
                                    {['inprogress', 'Pending', 'Done'].map(status => (
                                        <button onClick={() => handleStatus(status, task.id)}
                                            key={status}
                                            className={`px-2 py-1 rounded-md text-sm font-medium transition-all cursor-pointer hover:scale-101 ${task.status.toLowerCase() === status.toLowerCase()
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            {status === 'inprogress' ? 'In Progress' : status}
                                        </button>
                                    ))}
                                </div>
                                <div className=" w-full flex justify-between">
                                    <p className="text-sm font-extralight">{formatDate(task.due_date)}</p>
                                    <button onClick={() => deleteTask(task.id)} className="bg-red-400 rounded-lg px-2 py font-bold text-white cursor-pointer hover:bg-red-500">Delete task</button>
                                </div>

                            </div>
                        ))
                    }
                </div>
                <div className=" p-2 flex flex-col gap-2">
                    <div className="border h-10 flex justify-center items-center gap-2 rounded-md border-gray-300"><h1 className="text-2xl font-bold text-gray-400">Done</h1></div>
                    {
                        tasks.filter(t => t.status === 'done').map(task => (
                            <div key={task.id} className=" rounded-md  bg-pink-200 p-3 flex flex-col items-center cursor-pointer hover:scale-102">
                                <div className="flex  w-full justify-between px-2">
                                    <h1 className="text-xl font-bold">{task.title}</h1>
                                    <p className="font-semibold">{task.priority}</p>
                                </div>
                                <div className="p-1 w-full flex justify-between px-2">
                                    {['inprogress', 'Pending', 'Done'].map(status => (
                                        <button onClick={() => handleStatus(status, task.id)}
                                            key={status}
                                            className={`px-2 py-1 rounded-md text-sm font-medium transition-all cursor-pointer hover:scale-101 ${task.status.toLowerCase() === status.toLowerCase()
                                                ? 'bg-pink-500 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            {status === 'inprogress' ? 'In Progress' : status}
                                        </button>
                                    ))}
                                </div>
                                <div className=" w-full flex justify-between">
                                    <p className="text-sm font-extralight">{formatDate(task.due_date)}</p>
                                    <button onClick={() => deleteTask(task.id)} className="bg-red-400 rounded-lg px-2 py font-bold text-white cursor-pointer hover:bg-red-500">Delete task</button>
                                </div>

                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
