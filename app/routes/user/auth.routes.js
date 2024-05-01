const controller = require('../../controller/user/auth/auth.controller');
const commonServices = require('../../controller/user/auth/common.services');
const authJwt = require('../../middleware/authjwt');




module.exports = (app) => {
    app.post('/api/user/register', commonServices.userRegisterValidation, controller.registerUser);
    app.post('/api/user/register', commonServices.userRegisterValidation, controller.loginUser);
    app.put('/api/user/login', commonServices.userLoginValidation, controller.loginUser);
    app.get("/api/user/logout", authJwt.verifyUserToken, controller.userLogout);
    app.put('/api/user/profile', authJwt.verifyUserToken, controller.updateUser);
    app.get('/api/user/profile', authJwt.verifyUserToken, controller.getUserById);

};