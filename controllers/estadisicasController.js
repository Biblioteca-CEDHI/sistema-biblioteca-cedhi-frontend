// controlador de estadisticas
const Prestamo = require('../models/prestamosModel');
const Libro = require('../models/libroModel');
const Usuario_cedhi = require('../models/usuarioModel');
const {Op,fn,col} = require('sequelize');
const sequelize = require('../config/db');

//estadistica libro semestral, rankings


const estadisticaLibros = async (req, res) => {
    try {
        console.log("ESTADÍSTICAS DE LIBROS");

        const fecha_actual = new Date();
        fecha_actual.setMonth(fecha_actual.getMonth() - 6);

        const estadisticas = await Prestamo.findAll({
            attributes: [
                [sequelize .col('libro.titulo'), 'titulo'],
                [sequelize.fn('COUNT', sequelize.col('Prestamo.id_prestamo')), 'total_prestamos']
            ],
            include: [
                {
                    model: Usuario_cedhi,
                    attributes: ['codigo', 'nombres', 'email'],
                    as: 'usuario_cedhi'
                },
                {
                    model: Libro,
                    attributes: [], // Evita incluir 'titulo' aquí
                    as: 'libro'
                }
            ],
            group: ['libro.titulo', 'usuario_cedhi.codigo', 'usuario_cedhi.nombres', 'usuario_cedhi.email'],
            order: [[sequelize.fn('COUNT', sequelize.col('Prestamo.id_prestamo')), 'DESC']]
        });
        
        

        res.status(200).json({ estadisticas });
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};



//estadistica usuario mas prestado, rankings

const estadisticaUsuarios = async (req, res) => {
    try {
        console.log("ESTADÍSTICAS DE USUARIOS");

        
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() - 6);

        const estadisticas = await Prestamo.findAll({
            attributes: [
                [sequelize .col('usuario_cedhi.nombres'), 'nombres'],
                [sequelize.fn('COUNT', sequelize.col('Prestamo.id_prestamo')), 'total_prestamos']
            ],
            include: [
                {
                    model: Usuario_cedhi,
                    attributes: ['codigo', 'nombres', 'email'],
                    as: 'usuario_cedhi'
                },
                {
                    model: Libro,
                    attributes: [], // Evita incluir 'titulo' aquí
                    as: 'libro'
                }
            ],
            group: ['usuario_cedhi.codigo', 'usuario_cedhi.nombres', 'usuario_cedhi.email'],
            order: [[sequelize.fn('COUNT', sequelize.col('Prestamo.id_prestamo')), 'DESC']]
        });
        

        res.status(200).json({ estadisticas });
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};


const getTotal = async(req,res)=>{
    try {
        const total_libros = await Libro.count();
        console.log("TOTAL LIBROS: ",total_libros);
        const total_usuarios = await Usuario_cedhi.count();
        console.log("TOTAL USUARIOS: ",total_usuarios);
        res.status(200).json({
            estadisticas:[
            {libros: total_libros},
            {usuarios:total_usuarios}]
        })

        
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
}


module.exports = {
    estadisticaLibros,
    estadisticaUsuarios,
    getTotal
}