const {DataTypes} = require('sequelize');
const sequelize = require("../config/db");

/**
 * Modelo de usuario que cuenta con un email, password, y username
 * a columna categoria hace referencia a los permisos de administrador y tutor
 */

const User = sequelize.define('User',
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        nombre:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        apellidos:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        categoria:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        sexo:{
            type:DataTypes.STRING,
            allowNull:false
        }
        
    }
);

module.exports = User;
