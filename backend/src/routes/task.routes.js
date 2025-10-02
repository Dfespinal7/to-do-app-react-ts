import { Router } from "express";
import { createTask, deleteTask, getMytask, updateTask } from "../controllers/task.controller.js";
import { authValidate } from "../middlewares/auth.middleware.js";

export const taskRoute=Router()

taskRoute.get('/mytasks',authValidate, getMytask)
taskRoute.post('/task',authValidate, createTask)
taskRoute.put('/task/:id', authValidate,updateTask)
taskRoute.delete('/task/:id', authValidate,deleteTask)