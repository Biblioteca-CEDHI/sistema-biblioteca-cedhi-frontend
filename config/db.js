const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        //port:process.env.DB_PORT,
        dialect:'postgres',
        logging:(message)=>{
            if(message.includes('ERROR')) {
                console.log(message);
            }
        }
    }
);

module.exports = sequelize;

