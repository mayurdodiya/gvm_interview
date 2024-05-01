// const db = require('../models');
const controller = require('../../controller/user/movies/movies.controller');
const commonServices = require('../../controller/user/movies/common.services');
const authJwt = require('../../middleware/authjwt');





module.exports = (app) => {
    app.get('/api/user/movies', [authJwt.verifyUserToken], controller.viewAllMovies);
    app.get('/api/user/movies/showtime/:id', [authJwt.verifyUserToken], controller.viewAllSeatingOfShwosTime);
    app.get('/api/user/movies/:id', [authJwt.verifyUserToken], controller.getMovieById);
};