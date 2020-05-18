const Sequelize = require('sequelize');

// Connects with pgAdmin
const sequelize = new Sequelize(process.env.NAME, 'postgres', process.env.PASS, {
   host: 'localhost',
   dialect: 'postgres' 
});

sequelize.authenticate()
    .then(() => console.log('*** POSTGRES DB IS CONNECTED! ***'))
    .catch(err => console.log(err));

module.exports = sequelize; 