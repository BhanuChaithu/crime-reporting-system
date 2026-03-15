const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'crime_reporting_system',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Connected...');
        // Sync models
        await sequelize.sync({ alter: true });
        console.log('Database Synced');
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
    }
};

module.exports = { sequelize, connectDB };
