//
//solo se envia el id de la sancion

const Sancion = require("../models/sancionmodel");
const Usuario_cedhi = require("../models/usuarioModel");
const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

/*
const getSanciones = async (req, res) => {
    try {
        const fecha_actual = new Date();

        // Obtener todas las sanciones y los usuarios asociados
        const sanciones = await Sancion.findAll();
        const usuarios = await Usuario_cedhi.findAll({
            attributes: ['codigo', 'nombres']
        });

        
        const usuarios_map = usuarios.reduce((map, usuario) => {
            map[usuario.codigo] = usuario.nombres;
            return map;
        }, {});

        //console.log("USUARIOS MAP: ",usuarios_map);
        //console.log("USUARIO BUSCADO: ",usuarios_map['60246806'])

        
        const sanciones_dias_restantes = await Promise.all(sanciones.map(async sancion => {
            const fecha_inicio = sancion.fecha_inicio;
            const dias_sancion = sancion.tipo_sancion;
            const fecha_fin = new Date(fecha_inicio);
            fecha_fin.setDate(fecha_fin.getDate() + dias_sancion);

            
            let dias_restantes = 0;

            if (fecha_fin > fecha_actual) {
                dias_restantes = parseInt((fecha_fin.getTime() - fecha_actual.getTime()) / (1000 * 60 * 60 * 24));
            }

            
            if (dias_restantes === 0) {
                await Sancion.destroy({
                    where: { id_usuario: sancion.id_usuario }
                });

                await Usuario_cedhi.update(
                    {existe_sancion:false},
                    {where:{codigo:sancion.id_usuario}}
                )

                return null;

            }

            return {
                ...sancion.toJSON(),
                tipo_sancion: dias_restantes,
                nombres: usuarios_map[sancion.id_usuario] || "usuario"
            };
        }));

        res.status(200).json({
            sancion: sanciones_dias_restantes
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
};
*/

const getSanciones3 = async (req, res) => {
  try {
    const sanciones = await Sancion.findAll();
    res.status(200).json({
      sancion: sanciones,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "error en el servidor", error });
  }
};

const getSanciones2 = async (req, res) => {
  try {
    console.log("INICIAR LAS SANCION");
    const sanciones = await sequelize.query(
      `SELECT "Sancions".*, "Usuario_cedhis".nombres 
             FROM "Sancions" 
             LEFT JOIN "Usuario_cedhis"
             ON "Sancions".id_usuario = "Usuario_cedhis".codigo`,
      {
        type: QueryTypes.SELECT,
      }
    );
    console.log("Sancion");
  } catch (error) {
    console.log("EL ERROR ES: ", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const removeSancion = async (req, res) => {
  try {
    const { id_sancion } = req.params;
    const sanction = await Sancion.update(
      { estado: false },
      { where: { id_sancion } }
    );
    const get_sanction = await Sancion.findByPk(id_sancion);

    const usuario_cedhi = await Usuario_cedhi.update(
      { existe_sancion: false },
      { where: { codigo: get_sanction.id_usuario } }
    );

    res.status(200).json({ message: "Sancion removida correctamente" });
  } catch (error) {
    console.log("Error al borrar la sancion", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  removeSancion,
  getSanciones2,
  getSanciones3,
};
