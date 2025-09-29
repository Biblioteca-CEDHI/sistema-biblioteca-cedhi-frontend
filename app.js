const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const booksRoutes = require("./routes/booksRoutes");
const csvRoutes = require("./routes/csvRoutes");
const Libro = require("./models/libroModel");
const User = require("./models/userModel");
const Usuario_cedhi = require("./models/usuarioModel");
const Sancion = require("./models/sancionmodel");
const loanRoutes = require("./routes/loansRoutes");
const Prestamo = require("./models/prestamosModel");
const sancionRoutes = require("./routes/sancionRoutes");
const usuariosRoutes = require("./routes/usuarioRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

require("dotenv").config();

const app = express();

// MIDDLEWARES

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3010","http://localhost"],
    credentials: true,
  })
);

//ROUTES

app.use("/api/auth", authRoutes);

app.use("/api/booksget", booksRoutes);

app.use("/api/personas", csvRoutes);

app.use("/api/loans", loanRoutes);

app.use("/api/sanction", sancionRoutes);

app.use("/api/usuarios", usuariosRoutes);

app.use("/api/estadisticas", statisticsRoutes);

// SINCRONIZACION DE BASE DE DATOS

sequelize
  .sync()
  .then(() => {
    const port = process.env.PORT || 3000;

    /**
     * sequelize.query("ALTER SEQUENCE libros_registro_seq RESTART WITH 1000001;")
        .then(() => {
            console.log("Secuencia de 'registro' inicializada en 1000001");
        })
        .catch((err) => {
            console.error('Error al establecer la secuencia: ', err);
        });
     */

    app.listen(port, () => {
      console.log(`servidor ha sido incializado en el puerto ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error conectando con la base de datos: ", err);
  });

/**
 * Leer libros, todos los libros con todos los datos para el sabado en la manana-> todos los libros con cmapos mas simples
 * Leer libro en especifico con todos los campos
 * Eliminar libro
 * Editar libro
 * Agregar libro
 *
 *
 *
 */
