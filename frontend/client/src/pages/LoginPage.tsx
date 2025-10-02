import { Link } from 'react-router-dom'
import { ContextUse } from '../context/AutContext'

export default function LoginPage() {
    const { login, handleSubmitLogin, alert, message, userLogin } = ContextUse()
    

    return (
        <div className='border h-screen bg-gray-100 flex flex-col items-center py-15'>

            <div className=' p-4 w-80 bg-white rounded-xl shadow-md flex flex-col items-center justify-center gap-3 h-60'>
                <div className='h-8'>
                    {
                        alert && (
                            <p className={message?.style}>{message?.message}</p>
                        )
                    }
                </div>
                <h1 className='text-2xl font-bold text-gray-400'>Login</h1>
                <form onSubmit={handleSubmitLogin} action="" className='flex flex-col  w-full h-full justify-between'>
                    <input value={userLogin?.email} name='email' onChange={login} type="text" placeholder='Email' className='border rounded-lg px-2 py-1 shadow-lg border-gray-400' />
                    <input value={userLogin?.password} name='password' onChange={login} type="text" placeholder='Contraseña' className='border rounded-lg px-2 py-1 shadow-lg border-gray-400' />
                    <button className=' rounded-md bg-blue-300 font-bold text-white px-2 py-1 cursor-pointer hover:bg-blue-700'>Login</button>
                </form>
            </div>
            <p>Do you have an account? <span className='text-blue-400' ><Link to={'/register'}>Click on here</Link></span></p>
        </div>
    )
}
