const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');


const sequelize = new Sequelize(dbConfig.DB, dbConfig.USERNAME, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT
});

// create table
const db = {}
db.users = require('./users.model.js')(sequelize, Sequelize);
db.movies = require('./movies.model.js')(sequelize, Sequelize);
db.showtimes = require('./showtimes.model.js')(sequelize, Sequelize);
db.seating_arragements = require('./seating_arragement.model.js')(sequelize, Sequelize);


// join query relation
db.movies.hasMany(db.showtimes, { foreignKey: "movie_id", as: "movie_showtime" });
// db.users.hasOne(db.patients, { foreignKey: "user_id", as: "patients" });


db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;


try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}