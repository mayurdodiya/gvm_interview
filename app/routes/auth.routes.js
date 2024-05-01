const db = require('../models');
const authController = require('../controller/admin/auth/auth.controller');
const authJwt = require('../middleware/authjwt');
const authCommonServices = require('../controller/admin/auth/common.services');


// module.exports = function (app) {
//     app.use(function (req, res, next) {
//         res.header(
//             "Access-Control-Allow-Headers",
//             "x-access-token, Origin, Content-Type, Accept"
//         );
//         next();
//     });


// app.put('/api/admin/login', authController.loginAdmin);
// app.get("/api/admin/logout", authJwt.verifyAdminToken, authController.adminLogout);
// }





module.exports = (app) => {
    app.put('/api/admin/login', authCommonServices.adminLoginValidation, authController.loginAdmin);
    app.get("/api/admin/logout", authJwt.verifyAdminToken, authController.adminLogout);
    app.put('/api/admin/profile', authJwt.verifyAdminToken, authController.updateAdmin);
    app.get('/api/admin/profile', authJwt.verifyAdminToken, authController.getAdminById);
};