const dotenv = require('dotenv');
dotenv.config();
console.log('Pass extracted:', process.env.DB_PASS);
console.log('Pass length:', process.env.DB_PASS ? process.env.DB_PASS.length : 0);
