const {DataTypes}  = require('sequelize');
const sequelize =  require('../config/db');
const Libro = require('./libroModel');
const Usuario_cedhi = require('./usuarioModel');

const Prestamo = sequelize.define('Prestamo',
    {
        id_prestamo:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        registro:{
            type:DataTypes.INTEGER,
            references:{
                model:Libro,
                key:'registro'
            }
        },
        codigo:{
            type:DataTypes.INTEGER,
            references:{
                model:Usuario_cedhi,
                key:'codigo'
            }
        },
    
        fecha_prestamo:{
            type:DataTypes.DATE,
            allowNull:true,
        },
        fecha_devolucion_estimada:{
            type:DataTypes.DATE,
        },
        fecha_devolucion_real:{
            type:DataTypes.DATE,
            allowNull:true
        },
        estado:{
            type:DataTypes.STRING,
            
        }
    },
);

Prestamo.belongsTo(Libro,{foreignKey:'registro',as: 'libro'});
Prestamo.belongsTo(Usuario_cedhi,{foreignKey:'codigo', as: 'usuario_cedhi'});

module.exports = Prestamo;