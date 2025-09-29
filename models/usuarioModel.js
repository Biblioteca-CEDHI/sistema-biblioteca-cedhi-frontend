const {DataTypes}  = require('sequelize');
const sequelize =  require('../config/db');

/**
 * Usuario puede ser Alumno, biliotecario,egresado, personal y cualquier otra persona que este en  CEDHI
 */

const Usuario_cedhi = sequelize.define('Usuario_cedhi',
    {
        
        codigo:{
            type:DataTypes.INTEGER,
            primaryKey:true,
        },
        nombres:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        categoria:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        sexo:{
            type:DataTypes.STRING,
            allowNull:false
        },
        existe_sancion:{
            type:DataTypes.BOOLEAN,
            allowNull:true
        }
        
    }

);

module.exports = Usuario_cedhi;