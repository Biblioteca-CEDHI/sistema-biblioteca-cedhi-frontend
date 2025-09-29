//Obtener la informacion de alumnos
const Usuario_cedhi = require("../models/usuarioModel");

const searchStudentById = async (id_usuario_cedhi) =>{
    console.log("Inicio de busqueda de estudiante ");

    if(!id_usuario_cedhi){
        throw new Error("No existe ese id");
        
    }
    const usuario_cedhi = await Usuario_cedhi.findByPk(id_usuario_cedhi);
    if(!usuario_cedhi){
        throw new Error("No se encontro el alumno");
    }
    
    return usuario_cedhi;
};

module.exports={
    searchStudentById,
}