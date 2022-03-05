const express = require('express');
const expressConfig = require('./config/express');
const databaseConfig = require('./config/database');

const routsConfig = require('./config/routes');



start();

async function start() {
    const app = express();
    expressConfig(app);
    await databaseConfig(app);
    routsConfig(app);


    app.listen(3000, () => console.log('Server listens on port 3000'))

}