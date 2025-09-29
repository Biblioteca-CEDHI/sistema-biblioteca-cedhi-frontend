/**
 * code that allow you to update or insert new book information
 */


const Libro = require('../models/libroModel');

/**
 * addbook-> permite agregar un libro con los datos que se tiene en la
   base de datos
 */
const addBook = async (req,res) =>{
    
    console.log(req.body);
    try {
        const libro = await Libro.create({
            registro:req.body.registro,
            ubicacion_estanteria:req.body.ubicacion_estanteria,
            titulo:req.body.titulo,
            autor:req.body.autor,
            codigo_dewey:req.body.codigo_dewey,
            notacion_interna:req.body.notacion_interna,
            codigo:req.body.codigo,
            isbn:req.body.isbn,
            editorial:req.body.editorial,
            tema:req.body.tema,
            idioma:req.body.idioma,
            tipo_material:req.body.tipo_material,
            num_paginas:req.body.num_paginas,
            num_edicion:req.body.num_edicion,
            ciudad:req.body.ciudad,
            ano:req.body.ano,
            tabla_contenido:req.body.tabla_contenido,

        });
        res.status(201).json({
            mensaje:'Se agrego el libro correctamente',
            libro:libro.titulo
        });

        
    } catch (error) {
        return res.status(500).json({mensaje:'error en el servidor'});
    }
    
} 

/**
 * updateBook-> actualizqa los datos que se envien en solo
 */
const updateBook =async(req,res)=>{
    console.log("INICIO DEL UPDATE DE LIBROS");
    const {registro, ...updateData} = req.body;
    console.log("REGISTRO: ",registro);
    
    try {
        const libro = await Libro.findByPk(registro);

        if(!libro){
            return res.status(404).json({mensaje:'Libro no encontrado'});
        }

        
        await libro.update(updateData);

        
        res.json({
            message: 'Libro actualizado exitosamente',
            data: libro
        });
        
    } catch (error) {
        res.status(500).json({mensaje:"Error al actualizar el libro",error});
    }

}

module.exports = {
    addBook,
    updateBook
}