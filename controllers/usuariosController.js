const Usuario_cedhi = require('../models/usuarioModel');


const getAllUsuarios = async(req,res) => {
    try {
        const usuario_cedhi = await Usuario_cedhi.findAll();
        res.status(200).json({
            usuarios:
                usuario_cedhi
        });
    } catch (error) {
        res.status(500).json({mensaje:"error en el servidor",error});
    }
}



const addUsuarioCedhi = async(req,res) =>{
    const{codigo, nombres,email,categoria,sexo} = req.body;
    try {
        const nuevoUsuario = await Usuario_cedhi.create({
            codigo:codigo,
            nombres:nombres,
            email:email,
            categoria:categoria,
            sexo:sexo
        })
        res.status(201).json({
            mensaje:"Usuario agregado correctamente",
            usuario:nuevoUsuario
        })
        
    } catch (error) {
        console.log("Error al ingresar el usuario.",error);
        res.status(500).json({error:"Error en el servidor"});
    }
};

const updateUsuarioCedhi = async(req,res) =>{
    try {
        const {codigo, ...updadatedFields} = req.body;
        console.log(codigo)
        const usuario_cedhi = await Usuario_cedhi.findByPk(codigo);
        if(!usuario_cedhi){
            return res.status(404).json({mensaje:"Usuario no encontrado"});
        }
        await usuario_cedhi.update(updadatedFields);
        res.json({
            mensaje:"Libro actualizado exitosamente",
            usuario_cedhi
        });
        
        
    } catch (error) {
        console.log("Error al actualizar el usuario.",error);
        res.status(500).json({error:"Error en el servidor"});
    }
}

const deleteUsuarioCedhi = async(req,res) =>{
    try {
        const {codigo} = req.params;
        console.log(codigo)
        const usuario_cedhi = await Usuario_cedhi.findByPk(codigo);
        if(!usuario_cedhi){
            return res.status(404).json({mensaje:"Usuario no encontrado"});
        }
        await usuario_cedhi.destroy();
        res.status(201).json({mensaje:"usuario eliminado correctamente."})
        
    } catch (error) {
        console.log("Error al actualizar el usuario.",error);
        res.status(500).json({error:"Error en el servidor"});
    }
} 

module.exports ={
    getAllUsuarios,
    addUsuarioCedhi,
    updateUsuarioCedhi,
    deleteUsuarioCedhi
}