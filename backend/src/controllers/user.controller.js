import { pool } from "../db.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config';

export const index = (req, res) => {

    res.json({ message: 'index' })
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(401).json({ message: 'Debe ingresar todos los campos' })
        }
        const exist = await pool.query('SELECT * FROM users where email=$1', [email])
        if (exist.rows.length > 0) {
            return res.status(409).json({ message: 'El usuario ya esta registrado, intenta con nuevo correo' })
        }
        if (password.length < 8) {
            return res.status(409).json({ message: 'La contraseña debe tener al menos 8 caracteres' })
        }
        const hashPassword = await bcrypt.hash(password, 10)

        const result = await pool.query('INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *', [name, email, hashPassword])
        const user = result.rows[0]
        const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1d' })
        res.cookie('token', token)
        const userProtected = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        res.json({ message: 'Usuario creado correctamente', userProtected })
    }
    catch (e) {
        res.status(404).json({ ERROR: e.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(404).json({ message: 'debe llenar todos los datos' })
    }
    const result = await pool.query('SELECT * FROM users where email=$1', [email])
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Correo no registrado' })
    }
    const user = result.rows[0]
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.status(400).json({ message: 'Contraseña incorrecta' })
    }
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1d' })
    res.cookie('token', token)
    res.json({ message: 'Bienvenido usuario' })
}
export const logout = (req, res) => {
    try {
        res.clearCookie('token')
        res.json({ message: 'Sesion cerrada correctamente' })
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM USERS')
        res.json(result.rows)
    } catch (e) {
        res.status(401).json({ error: e.message })
    }
}