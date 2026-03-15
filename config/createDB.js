const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const createDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || ''
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'crime_reporting_system'}\`;`);
        console.log('Database Created or Already Exists');
        await connection.end();
        process.exit();
    } catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    }
};

createDB();
