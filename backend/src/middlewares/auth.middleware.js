import jwt from 'jsonwebtoken'
import 'dotenv/config';
export const authValidate=(req,res,next)=>{
    try{
    const token=req.cookies.token
    if(!token){
        return res.status(404).json({message:'token no encontrado'})
    }
    const verify=jwt.verify(token,process.env.TOKEN_SECRET)
    req.user=verify
    next()
    }catch(e){
       return res.status(401).json({message:'token invalido o expirado'})
    }
}
