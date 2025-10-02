import express from 'express'
import 'dotenv/config';
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { taskRoute } from './routes/task.routes.js';
import { userRoute } from './routes/user.routes.js';
const app=express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(userRoute)
app.use(taskRoute)



const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`PUERTO ${PORT} CORRIENDO`)
})