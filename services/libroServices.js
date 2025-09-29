

const Libro = require("../models/libroModel");

const findBookByRegister = async (registro)=>{

    //console.log("EL REGISTRO: ",registro);

    if(!registro){
        throw new Error("El libro no se encuentra");
    }

    const libro = await Libro.findOne({where:{registro}});
    if(!libro){
        throw new Error("Libro no encontrado");
        
    }
    
    return libro;
};


module.exports = {
    findBookByRegister,
};