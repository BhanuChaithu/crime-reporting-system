const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

console.log('Testing Database Connection...');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('DB Name:', process.env.DB_NAME);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('SUCCESS: Connection has been established successfully.');
        const [results, metadata] = await sequelize.query("SHOW TABLES");
        console.log('Tables found:', results.map(r => Object.values(r)[0]));
        process.exit(0);
    } catch (error) {
        console.error('FAILURE: Unable to connect to the database:', error.message);
        process.exit(1);
    }
})();
