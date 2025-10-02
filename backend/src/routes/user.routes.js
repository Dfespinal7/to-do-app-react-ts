import { Router } from "express";
import { getAllUsers, index, login, logout, register } from "../controllers/user.controller.js";
import { authValidate } from "../middlewares/auth.middleware.js";

export const userRoute=Router()

userRoute.get('/',authValidate, index)
userRoute.post('/register',register)
userRoute.post('/login',login)
userRoute.get('/users',getAllUsers)
userRoute.post('/logout',logout)