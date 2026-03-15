const mysql = require('mysql2/promise');
const passwords = ['', 'root', 'admin', '1234', '123456', '12345678', 'password', 'crime', 'crrime'];
(async () => {
    for (const pass of passwords) {
        try {
            console.log(`Trying password: "${pass}"...`);
            const connection = await mysql.createConnection({
                host: '127.0.0.1',
                user: 'root',
                password: pass
            });
            console.log(`SUCCESS with password: "${pass}"`);
            await connection.end();
            process.exit(0);
        } catch (error) {
            console.log(`FAILED with password: "${pass}" - ${error.message}`);
        }
    }
    console.log('All attempts failed.');
    process.exit(1);
})();
