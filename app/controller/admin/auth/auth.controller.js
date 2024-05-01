const db = require('../../../models');
const otherConfig = require('../../../config/other.config');
const commonResponse = require('./common.response.js')
const message = require('./../../message.js')
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { methods: commonServices, pincodeExist } = require('../../../services/common');

const User = db.users;





// admin Login
exports.loginAdmin = async (req, res) => {
    try {
        const email = req.body.email;
        const pwd = req.body.password;
        const query = { where: [{ role_id: { [Op.or]: [1, 2] } }, { email: email }, { is_active: 1 }] };

        const isExistingEmail = await commonServices.get(User, query)
        if (isExistingEmail) {
            let passwordValidate = await commonServices.passwordCompare(pwd, isExistingEmail.password);

            let token = commonServices.generateToken(isExistingEmail.id, isExistingEmail.role_id);

            if (passwordValidate == true) {
                res.status(200).json({
                    success: "true",
                    message: message.LOGIN_SUCCESS,
                    data: commonResponse.logInRes({ isExistingEmail, token }),
                });
            } else {
                res.status(200).json({ success: "false", message: message.INVALID("Password") });
            }
        } else {
            res.status(200).json({ success: "false", message: message.NO_DATA("Admin") });
        }
    } catch (error) {
        res.status(200).json({ success: "false", message: error.message })
    }

};

// admin Logout
exports.adminLogout = async (req, res) => {

    try {

        const user = req.user;
        if (user) {
            res.status(200).json({ success: "true", message: message.LOGOUT_SUCCESS });
        } else {
            res.status(200).json({ success: "true", message: message.LOGOUT_FAILED });
        }

    } catch (error) {
        res.status(200).json({ success: "false", message: error.message })
    }

};

// update
exports.updateAdmin = async (req, res) => {
    try {
        const obj = {
            full_name: req.body.full_name,
            email: req.body.email,
            countryCode: req.body.countryCode,
            phone_no: req.body.phone_no,
            profile_image: req.body.profile_image
        }
        // const data = await User.update(obj, { where: { id: req.user.id } });
        const data = await commonServices.update(User, { where: { id: req.user.id } }, obj)
        if (data) {
            res.status(200).json({ success: true, message: message.UPDATE_PROFILE('Your profile') })
        } else {
            res.status(200).json({ success: false, message: message.NOT_UPDATE })
        }
    } catch (error) {
        res.status(200).json({ success: false, message: error.message })
    }
};

// view profile
exports.getAdminById = async (req, res) => {
    try {
        const data = req.user
        const response = commonResponse.modifyAdminRes(data);
        res.status(200).json({ success: true, message: message.GET_DATA("Your profile"), data: response })
    } catch (error) {
        res.status(200).json({ success: false, message: error.message })
    }
};

