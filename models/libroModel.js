const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const Libro = sequelize.define('libro', {

    registro: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    ubicacion_estanteria: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    titulo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    autor: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    codigo_dewey: {
        type: DataTypes.REAL,
        allowNull: true,
    },
    notacion_interna: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    editorial: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tema: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    idioma: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tipo_material: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    num_paginas: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    num_edicion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ciudad: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ano: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tabla_contenido: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    disponibilidad: {
        type: DataTypes.BOOLEAN,
        allowNull:true
    },
    url_cover:{
        type:DataTypes.STRING,
        allowNull:true
    }
}, {
    timestamps: false,

    // Agregar hooks para el trim
    hooks: {
        beforeUpdate: (libro, options) => {
            // Aplicamos trim solo si el valor es una cadena
            if (typeof libro.titulo === 'string') libro.titulo = libro.titulo.trim();
            if (typeof libro.autor === 'string') libro.autor = libro.autor.trim();
            if (typeof libro.codigo_dewey === 'string') libro.codigo_dewey = libro.codigo_dewey.trim();
            if (typeof libro.notacion_interna === 'string') libro.notacion_interna = libro.notacion_interna.trim();
            if (typeof libro.codigo === 'string') libro.codigo = libro.codigo.trim();
            if (typeof libro.isbn === 'string') libro.isbn = libro.isbn.trim();
            if (typeof libro.editorial === 'string') libro.editorial = libro.editorial.trim();
            if (typeof libro.tema === 'string') libro.tema = libro.tema.trim();
            if (typeof libro.idioma === 'string') libro.idioma = libro.idioma.trim();
            if (typeof libro.tipo_material === 'string') libro.tipo_material = libro.tipo_material.trim();
            if (typeof libro.num_paginas === 'string' && libro.num_paginas === '') libro.num_paginas = null;
            if (typeof libro.num_edicion === 'string') libro.num_edicion = libro.num_edicion.trim();
            if (typeof libro.ciudad === 'string') libro.ciudad = libro.ciudad.trim();
            if (typeof libro.ano === 'string' && libro.ano === '') libro.ano = null;
            if (typeof libro.tabla_contenido === 'string') libro.tabla_contenido = libro.tabla_contenido.trim();
            if (typeof libro.url_cover === 'string') libro.url_cover = libro.url_cover.trim();
        },
        beforeCreate: (libro, options) => {
            // Mismo trim antes de crear un nuevo libro
            if (typeof libro.titulo === 'string') libro.titulo = libro.titulo.trim();
            if (typeof libro.autor === 'string') libro.autor = libro.autor.trim();
            if (typeof libro.codigo_dewey === 'string') libro.codigo_dewey = libro.codigo_dewey.trim();
            if (typeof libro.notacion_interna === 'string') libro.notacion_interna = libro.notacion_interna.trim();
            if (typeof libro.codigo === 'string') libro.codigo = libro.codigo.trim();
            if (typeof libro.isbn === 'string') libro.isbn = libro.isbn.trim();
            if (typeof libro.editorial === 'string') libro.editorial = libro.editorial.trim();
            if (typeof libro.tema === 'string') libro.tema = libro.tema.trim();
            if (typeof libro.idioma === 'string') libro.idioma = libro.idioma.trim();
            if (typeof libro.tipo_material === 'string') libro.tipo_material = libro.tipo_material.trim();
            if (typeof libro.num_paginas === 'string' && libro.num_paginas === '') libro.num_paginas = null;
            if (typeof libro.num_edicion === 'string') libro.num_edicion = libro.num_edicion.trim();
            if (typeof libro.ciudad === 'string') libro.ciudad = libro.ciudad.trim();
            if (typeof libro.ano === 'string'&& libro.num_paginas === '') libro.ano = null;
            if (typeof libro.tabla_contenido === 'string') libro.tabla_contenido = libro.tabla_contenido.trim();
            if (typeof libro.url_cover === 'string') libro.url_cover = libro.url_cover.trim();
        }
    }
});



module.exports = Libro;
