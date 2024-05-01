const db = require('../models');
const controller = require('../controller/admin/movies/movies.controller');
const authJwt = require('../middleware/authjwt');
const commonServices = require('../controller/admin/movies/common.services');





module.exports = (app) => {
    app.post('/api/admin/movies', [authJwt.verifyAdminToken], commonServices.addMoviesValidation, controller.addMovies);
    app.put('/api/admin/movies/:id', [authJwt.verifyAdminToken], controller.updteMovies);
    app.get('/api/admin/movies', [authJwt.verifyAdminToken], controller.viewAllMovies);
    app.get('/api/admin/moviesdropdown', [authJwt.verifyAdminToken], controller.viewAllMoviesDropdown);
    app.get('/api/admin/showtimesdropdown', [authJwt.verifyAdminToken], commonServices.showTimeDropDownValidation, controller.viewMoviesAllShowtimesDropdown);
    app.get('/api/admin/movies/:id', [authJwt.verifyAdminToken], controller.getMovieById);
    app.delete('/api/admin/movies/:id', [authJwt.verifyAdminToken], controller.deleteMovieById);

    app.post('/api/admin/movies/seating', [authJwt.verifyAdminToken], commonServices.addSeatingValidation, controller.addSeatingArragement);
};