import { pool } from "../db.js"

export const getMytask = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        const id = req.user.id
        const result = await pool.query('SELECT * FROM tasks where user_id=$1 order by id ASC', [id])
        res.json(result.rows)
    } catch (e) {
        return res.status(404).json({ message: e.message })
    }
}
export const createTask = async (req, res) => {
    try {
        const user_id = req.user.id
        const { title, status, priority, due_date } = req.body
        const titleMin = title.toLowerCase()
        const exist = await pool.query('SELECT * FROM tasks where title=$1', [titleMin])
        if (exist.rows.length > 0) {
            return res.status(409).json({ message: 'La tarea que intenta crear ya existe' })
        }
        if (!title | !status || !priority || !due_date) {
            return res.status(409).json({ message: 'debe ingresar todos los campos del formulario' })
        }
       
        const result = await pool.query('INSERT INTO tasks(title,status,priority,due_date,user_id) values($1,$2,$3,$4,$5) RETURNING *', [titleMin, status, priority, due_date, user_id])
        res.json(result.rows)

    } catch (e) {
        return res.status(400).json({ error: e.message })
    }
}

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const user_id = req.user.id
        const { title, status, priority, due_date } = req.body
        if (!title || !status || !priority || !due_date) {
            return res.status(409).json({ message: 'Debe ingrsar todos los datos si desea Actualizar esta tarea' })
        }
        if (!id) {
            return res.status(404).json({ message: 'You dont enter id' })
        }
        const validateTask=await pool.query('SELECT * FROM tasks where id=$1',[id])
        const taskFound=validateTask.rows[0]
        if(taskFound.user_id!==user_id){
            return res.status(400).json({message:'esta tarea no te pertenece'})
        }
        const result = await pool.query('UPDATE tasks set title=$1,status=$2,priority=$3,due_date=$4, user_id=$5 where id=$6 RETURNING *', [title, status, priority, due_date, user_id, id])
        res.json(result.rows[0])
    } catch (e) {
        return res.status(400).json({ error: e.message })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params
        const user_id=req.user.id
        const validateTask=await pool.query('SELECT * FROM tasks where id=$1',[id])
        if (validateTask.rows.length===0){
            return res.status(404).json({message:'Tarea no existe en la base de datos'})
        }
        const taskFound=validateTask.rows[0]
        if(taskFound.user_id!==user_id){
            return res.status(400).json({message:'esta tarea no te pertenece'})
        }
        await pool.query('DELETE FROM tasks where id=$1', [id])
        res.json({ message: 'Tarea eliminada!' })
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
}