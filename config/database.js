const mongoose = require('mongoose');

require('../models/User');
require('../models/Ad');


const dbName = 'jobAds'

const connecitonString = `mongodb://localhost:27017/${dbName}`;


module.exports = async (app) => {

    try {
        await mongoose.connect(connecitonString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Database connected');
        mongoose.connection.on('error', (err) => {
            console.error('Database error');
            console.error(err)
        })
    } catch (err) {
        console.error('Error connecting to database');
        process.exit(1);
    }
}