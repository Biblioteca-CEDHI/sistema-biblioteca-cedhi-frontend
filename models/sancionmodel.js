const {DataTypes} = require('sequelize');
const sequelize = require("../config/db");

const Sancion = sequelize.define('Sancion',
    {
        id_sancion:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        id_usuario:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        tipo_sancion:{  // se refiere a los dias 
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        estado:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
        },
        fecha_inicio:{
            type:DataTypes.DATE,
            allowNull:false
        }
    }
);

module.exports = Sancion;

