/**
 * Controlador para realizar una busqueda de un libro y verficar su disponibilidad
 * el primer elemento tiene que ser el numero de registro
 */

const {findBookByRegister} = require("../services/libroServices");
const Libro = require("../models/libroModel");


const requestBooks = async(req,res)=>{
    try {
        const libros = await Libro.findAll();
        res.status(200).json({
            books:
                libros
            });
    } catch (error) {
        res.status(500).json({mensaje:"error en el servidor",error});
    }
}


const requestBook =async (req,res)=>{
// findOne.({where:{columna:valor}})
    try {
        const tiempo = new Date();
        const peru_offset = -5 *60;
        const tiempo_peru = new Date(tiempo.getTime() + peru_offset *60*1000);
        const timepo_real = tiempo_peru.toISOString().replace('Z','');
        
        console.log("inicio del request");
        console.log("El tiempo actual: ",timepo_real);
        console.log("EL directorio: ",__dirname);
        const{registro} = req.params;
        const libro = await findBookByRegister(registro);
        

        if(libro.disponibilidad){
            //console.log("EL LIBRO ES", libro.dataValues)
            res.json({
                mensaje:'libro encontrado y disponible ',
                libro:libro.dataValues
            });    

        }else{
            res.json({
                mensaje:'libro encontrado, pero no disponible.',
                libro:libro.dataValues
            });    
        }
    } catch (error) {
        if(error.message === 'Falta el numero del registro'){
            return res.status(400).json({mensaje:error.message});
        }
        if(error.message === 'Libro no encontrado'){
            return res.status(404).json({mensaje:error.message});
        }
        res.status(500).json({mensaje:" Error en el servidor ",error});
    }
}


const addBook = async(req,res)=>{
    try {
        const {
            ubicacion_estanteria,
            titulo,
            autor,
            codigo_dewey,
            notacion_interna,
            codigo,
            isbn,
            editorial,
            tema,
            idioma,
            tipo_material,
            num_paginas,
            num_edicion,
            ciudad,
            ano,
            tabla_contenido,
            disponibilidad,
            url_cover,
        } = req.body;

        const nuevoLibro = await Libro.create({

            ubicacion_estanteria,
            titulo,
            autor,
            codigo_dewey,
            notacion_interna,
            codigo,
            isbn,
            editorial,
            tema,
            idioma,
            tipo_material,
            num_paginas,
            num_edicion,
            ciudad,
            ano,
            tabla_contenido,
            disponibilidad,
            url_cover,
        });


        res.status(201).json({
            mensaje: 'Libro agregado exitosamente',
            libro: nuevoLibro
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al agregar el libro',
            error: error.message
        });
    }


}

const deleteBook = async(req,res)=>{
    try {
        const {registro} = req.params;

        const libro = await Libro.findOne({where:{registro}});
        if(!libro){
            return res.status(404).json({mensaje:'libro no encontrado'});
        }

        await libro.destroy();
        res.json({mensaje:"Libro eliminado correctamente"});


    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje:"Error al borrar el libro",
            error:error.message
        })
    }

}

const updateBook = async(req,res)=>{
    try {
        const {registro,...updatedFields} = req.body;
        console.log("REGISTRO: ",registro);

        const libro = await findBookByRegister(registro);

        if(!libro){
            return res.status(404).json({mensaje:"Librto no encontrado"});
        }

        

        await libro.update(updatedFields);

        res.json({
            mensaje:"Libro actualizado exitosamente",
            libro
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje:"Error al actualizar el libro",
            error:error.message
        })
    }
}





module.exports = {
    requestBook,
    requestBooks,
    addBook,
    updateBook,
    deleteBook
};
