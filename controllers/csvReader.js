const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Usuario_cedhi = require('../models/usuarioModel');
const Libro = require('../models/libroModel');
const sequelize =  require('../config/db');

// Función para procesar y reemplazar usuarios masivamente
const processXLSXUsers = async (req, res) => {
    console.log("Archivo recibido: ", req.file);
    let i = 0;

    if (!req.file) {
        console.log("No existe el archivo");
        return res.status(400).send("No se ha recibido ningún archivo");
    }

    const file_path = path.join(__dirname, '../', req.file.path);
    console.log("Ruta del archivo:", file_path);

    try {
        // Reiniciar IDs y eliminar todos los usuarios
        await sequelize.query('TRUNCATE TABLE "Usuario_cedhis" RESTART IDENTITY CASCADE;');
        console.log("Usuarios anteriores eliminados y IDs reiniciados.");

        // Leer y procesar el archivo XLSX
        const rows = await readXLSX(file_path);

        if (rows.length === 0) {
            console.log("El archivo XLSX está vacío o no se pueden extraer los datos");
            return res.status(400).send("El archivo XLSX no contiene datos válidos");
        }

        // Procesar cada fila e insertar en la base de datos
        for (const row of rows) {
            console.log(`Procesando fila ${i}:`, {
                codigo: row.CODIGO,
                nombres: row.NOMBRES,
                email: row.EMAIL,
                categoria: row.CATEGORIA,
                sexo: row.SEXO,
                existe_sancion: 0,
            });

            await Usuario_cedhi.create({
                codigo: row.CODIGO,
                nombres: row.NOMBRES,
                email: row.EMAIL,
                categoria: row.CATEGORIA,
                sexo: row.SEXO,
                existe_sancion: 0,
            });

            i++;
        }

        // Eliminar el archivo temporal después del procesamiento
        await fs.promises.unlink(file_path);
        res.send('Usuarios reemplazados correctamente');
    } catch (error) {
        console.error("Error al procesar el archivo XLSX.", error);
        res.status(500).send('Error al procesar el archivo XLSX.');
    }
};

// Función para procesar y reemplazar libros masivamente
const updateBooksMassive = async (req, res) => {
    console.log('Archivo recibido:', req.file);
    let i = 0;

    if (!req.file) {
        console.log('No se ha recibido ningún archivo.');
        return res.status(400).send('No se ha recibido ningún archivo');
    }

    const file_path = path.join(__dirname, '../', req.file.path);
    console.log("Ruta del archivo:", file_path);

    try {
        // Reiniciar IDs y eliminar todos los libros
        await sequelize.query('TRUNCATE TABLE "libros" RESTART IDENTITY CASCADE;');
        console.log("Libros anteriores eliminados y IDs reiniciados.");

        await sequelize.query('ALTER SEQUENCE libros_registro_seq RESTART WITH 1000001');
        console.log("Secuencia de ID configurada para iniciar en 10001.");

        const rows = await readXLSX2(file_path);

        if (rows.length === 0) {
            console.log('El archivo XLSX está vacío o no se pudieron extraer datos.');
            return res.status(400).send('El archivo XLSX no contiene datos válidos.');
        }

        for (const row of rows) {
            //console.log("LIBRO y datos:", row);
            console.log('Procesando fila:', i);
            await Libro.create({
                ubicacion_estanteria: row.ubicacion_estanteria,
                titulo: row.titulo,
                autor: row.autor,
                codigo_dewey: row.codigo_dewey,
                notacion_interna: row.notacion_interna,
                codigo: row.codigo,
                isbn: row.isbn,
                editorial: row.editorial,
                tema: row.tema,
                idioma: row.idioma,
                tipo_material: row.tipo_material,
                num_paginas: row.num_paginas,
                num_edicion: row.num_edicion,
                ciudad: row.ciudad,
                ano: row.ano,
                tabla_contenido: row.tabla_contenido,
                disponibilidad: true,
            });
            i++;
        }

        // Eliminar el archivo temporal
        await fs.promises.unlink(file_path);
        res.send('Libros reemplazados correctamente');
    } catch (error) {
        console.error("Error al procesar el archivo XLSX:", error);
        res.status(500).send('Error al procesar el archivo XLSX.');
    }
};

// Función auxiliar para leer archivos XLSX
const readXLSX = (file_path) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = xlsx.readFile(file_path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            let rows = xlsx.utils.sheet_to_json(sheet);
            console.log("Cantidad de filas: ", rows.length);

            // Renombrar y limpiar claves de columnas si es necesario
            rows = rows.map(row => {
                const normalizedRow = {
                    CODIGO: row['CODIGO'] || row['Codigo'] || row['codigo'],
                    NOMBRES: row['NOMBRES'] || row['Nombres'] || row['nombres'],
                    EMAIL: row['EMAIL'] || row['Email'] || row['email'],
                    CATEGORIA: row['CATEGORIA'] || row['Categoria'] || row['categoria'],
                    SEXO: row['SEXO'] || row['Sexo'] || row['sexo'],
                
            }
            return normalizedRow;
        });
        rows = rows.filter(row=>row.CODIGO && row.NOMBRES && row.EMAIL && row.CATEGORIA && row.SEXO);

            resolve(rows);
        } catch (error) {
            console.error('Error al leer el archivo XLSX:', error);
            reject(error);
        }
    });
};

const readXLSX2 = (file_path) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = xlsx.readFile(file_path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            let rows = xlsx.utils.sheet_to_json(sheet);
            console.log("Cantidad de filas: ", rows.length);

            // Renombrar y limpiar claves de columnas
            rows = rows.map(row => {
                return {
                    ubicacion_estanteria: row['UBICACION_ESTANTERIA'] || row['Ubicación Estantería'] || row['ubicacion_estanteria'],
                    titulo: row['TITULO'] || row['Título'] || row['titulo'],
                    autor: row['AUTOR'] || row['Autor'] || row['autor'],
                    codigo_dewey: row['CODIGO_DEWEY'] || row['Código Dewey'] || row['codigo_dewey'],
                    notacion_interna: row['NOTACION_INTERNA'] || row['Notación Interna'] || row['notacion_interna'],
                    codigo: row['CODIGO'] || row['Código'] || row['codigo'],
                    isbn: row['ISBN'] || row['isbn'],
                    editorial: row['EDITORIAL'] || row['Editorial'] || row['editorial'],
                    tema: row['TEMA'] || row['Tema'] || row['tema'],
                    idioma: row['IDIOMA'] || row['Idioma'] || row['idioma'],
                    tipo_material: row['TIPO_MATERIAL'] || row['Tipo Material'] || row['tipo_material'],
                    num_paginas: row['NUM_PAGINAS'] || row['Número de Páginas'] || row['num_paginas'],
                    num_edicion: row['NUM_EDICION'] || row['Número de Edición'] || row['num_edicion'],
                    ciudad: row['CIUDAD'] || row['Ciudad'] || row['ciudad'],
                    ano: row['ANO'] || row['Año'] || row['ano'],
                    tabla_contenido: row['TABLA_CONTENIDO'] || row['Tabla de Contenido'] || row['tabla_contenido'],
                };
            });

          

            resolve(rows);
        } catch (error) {
            console.error('Error al leer el archivo XLSX:', error);
            reject(error);
        }
    });
};




module.exports = {
    updateBooksMassive,
    processXLSXUsers
};

