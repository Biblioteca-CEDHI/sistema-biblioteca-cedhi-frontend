// controlador para mostrar los prestamos de libros

const Libro = require('../models/libroModel');
const Alumno = require('../models/usuarioModel');
const Prestamo = require('../models/prestamosModel');
const{findBookByRegister} = require("../services/libroServices")
const {searchStudentById} = require('../services/alumnoServices')
const{Op} = require("sequelize");
const Usuario_cedhi = require('../models/usuarioModel');
const Sancion = require('../models/sancionmodel');

// Consultar disponibilidad del libro por regsitro

//Guardar el prestamo del libro con id de estudiante, POST

/**
 * 
 {
    registro_libro
    id_alumno
    fecha_actual
    fecha_retorno
 }
 */

//registrar prestamo de libro
const loanBookRegister = async (req, res) => {
    try {
        console.log("Inicio del prestamo del libro");

        const { registro, codigo, fecha_retorno } = req.body;
        
        // Intentamos obtener el usuario y el libro
        const usuario_cedhi = await Usuario_cedhi.findByPk(codigo);
        
        if (!usuario_cedhi) {
            return res.status(404).json({ mensaje: "No se encuentra el alumno" });
        }
        console.log("REGISTRO: ",registro);
        const libro = await findBookByRegister(registro);
        if (!libro) {
            return res.status(404).json({ mensaje: "No se encuentra el libro" });
        }
        console.log("LA DISPONIBILIDAD ES : ", libro.disponibilidad);
        if (!libro.disponibilidad) {
            return res.status(400).json({ mensaje: "El libro no está disponible para préstamo" });
        }

        console.log("USUARIO A PRESTAR:", usuario_cedhi.codigo);
        console.log("LIBRO DISPONIBILIDAD:", libro.disponibilidad);

        // Registramos el préstamo del libro
        const fecha_actual = new Date();
        const fecha_final = new Date(fecha_retorno);
        const prestamo = await Prestamo.create({
            codigo,
            registro,
            fecha_prestamo: fecha_actual,
            fecha_devolucion_estimada: fecha_final,
            estado:"Prestado"
        });

        // Actualizamos el estado del libro
        await libro.update({ disponibilidad: false });
        console.log("SE REGISTRO CORRECTAMENTE EL PRESTAMO")
        res.status(201).json({ message: "Se realizó correctamente el préstamo" });

    } catch (error) {
        console.error("Error al registrar el préstamo:", error.message);
        res.status(400).json({ error: "No se pudo realizar el guardado" });
    }
};

// modulo de prestamos realizados GET
// consultar que campos muestra, como el titulo y el usuario, y el tiempo estimado
const getAllLoans = async (req, res) => {
    console.log("OBTENER TODOS LOS PRÉSTAMOS", req.body);
    try {
        const loans = await Prestamo.findAll({
            include: [
                {
                    model: Usuario_cedhi,
                    attributes: ['nombres', 'email'],
                    as: 'usuario_cedhi'
                },
                {
                    model: Libro,
                    attributes: ['titulo'],
                    as: 'libro'
                }
            ]
        });

        const fecha_actual = new Date();

        const loans_result = await Promise.all(loans.map(async loan => {
            let estado = loan.estado === "Devuelto" ? "Devuelto" : (fecha_actual > loan.fecha_devolucion_estimada ? "Atrasado" : "Prestado");

            const dias = fecha_actual > loan.fecha_devolucion_estimada
                ? parseInt((fecha_actual.getTime() - loan.fecha_devolucion_estimada.getTime()) / (1000 * 60 * 60 * 24))
                : 0;

            if (estado === "Atrasado") {
                
                const sancionExistente = await Sancion.findOne({
                    where: {
                        id_usuario: loan.codigo,
                        estado: true // Sanción activa
                    }
                });

                
                if (!sancionExistente) {
                    await Sancion.create({
                        id_usuario: loan.codigo,
                        fecha_inicio: fecha_actual,
                        tipo_sancion: dias, 
                        estado: true 
                    });
                    await Usuario_cedhi.update(
                        { existe_sancion: true },
                        { where: { codigo: loan.codigo } }
                    );
                }
            }

            return {
                id_prestamo: loan.id_prestamo,
                registro: loan.registro,
                codigo: loan.codigo,
                fecha_prestamo: loan.fecha_prestamo,
                fecha_devolucion_estimada: loan.fecha_devolucion_estimada,
                fecha_devolucion_real: loan.fecha_devolucion_real,
                nombres: loan.usuario_cedhi ? loan.usuario_cedhi.nombres : null,
                titulo: loan.libro ? loan.libro.titulo : null,
                email: loan.usuario_cedhi ? loan.usuario_cedhi.email : null,
                estado: estado,
                dias: dias
            };
        }));
        console.log("Obtener prestamos :",loans_result);
        res.status(200).json({
            loans: loans_result
        });
    } catch (error) {
        console.error("Error al obtener los préstamos:", error);
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
};



//modulo de prestamos atrasados

const loansDelay =async (req,res)=>{
    try {
        console.log("Libros con retraso");
        const fecha_actual = new Date();
        const loans = await Prestamo.findAll({
            where:{
                fecha_devolucion_real:null,
                fecha_devolucion_estimada:{
                    [Op.lt]:fecha_actual
                }
            }
        });
        res.json(loans);
        
    } catch (error) {
        console.log("Error al consultar los delay");
        res.status(500).json({error:"Error en el servidor"});
    }
};

//Modulo de registrar devolucion de libro, obtener todos los los libros que tengan 
//id fecha prestamo
const loansReturn = async(req,res)=>{
    const {id_prestamo,codigo,fecha_real} = req.body;
    try {
        console.log("Se inicio el retorno del libro: ",id_prestamo);
        //const prestamo = await Prestamo.findByPk(id_prestamo);
        //console.log("PRESTAMO RETORNO : ",prestamo.dataValues);
        const loan = await Prestamo.findByPk(id_prestamo);
        if(!loan){
            return res.status(400).json({message:"Prestamo no encontrado"});
        }

        console.log("REGISTRO : ",loan);
        const libro = await Libro.findByPk(loan.registro);
        const fecha_real_formated = new Date(fecha_real);
        console.log("PRESTAMO: ",loan.registro);
        console.log("FECHA REAL: ",fecha_real_formated);
        console.log("FECHA ESTRIMADA: ",loan.fecha_devolucion_estimada);

        if(fecha_real_formated <= loan.fecha_devolucion_estimada){

            await libro.update({disponibilidad:true})
            await loan.update({
                fecha_devolucion_real:fecha_real,
                estado:"Devuelto",

            })
            console.log("ESTADO DE DEVOLUCION: ",loan.estado)
            console.log("SE DEVOLVIO SIN SANCION")
            res.status(201).json({message:"Se devolvio correctamente sin sanciones"});

        } else{
          //  const dias_retraso =  parseInt((fecha_real.getTime() - loan.fecha_devolucion_estimada.getTime()) / (1000 * 60 * 60 * 24 ));
            await libro.update({disponibilidad:true})
            await loan.update({
                fecha_devolucion_real:fecha_real,
                estado:"Devuelto"

            })
            const sancion = await Sancion.create({
                id_usuario : codigo,
                tipo_sancion:dias,
                estado:1
            })

            const usuario_update = await Usuario_cedhi.update(
                {existe_sancion:true},
                {where:{codigo:codigo}}
            )
            
            console.log("SE CREO CON UNA SANCION")
            res.status(201).json({message:"Se devolvio correctamente con sanciones"});
        }
        
        
        
    } catch (error) {
        console.log("Error al devolver el el libro",error);
        res.status(500).json({error:"Error en el servidor"});
    }
}

// eliminar prestamo
const deleteLoan = async(req,res)=>{
    const {id_prestamo} = req.params;

    try {
        const loan = await Prestamo.destroy({
            where:{id_prestamo}
        });
        if(loan){
            res.status(200).json({message:"Prestamo eliminado correctamente"});
        }else{
            res.status(404).json({message:"Prestamo no encontrado"});
        }
        
    } catch (error) {
        console.log("Error al eliminar el libro",error);
        res.status(500).json({error:"Error en el servidor"});
    }
}



module.exports = {
    getAllLoans,
    loanBookRegister,
    loansDelay,
    loansReturn,
    deleteLoan
}