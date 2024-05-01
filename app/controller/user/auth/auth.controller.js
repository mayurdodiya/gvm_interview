const db = require('../../../models');
const otherConfig = require('../../../config/other.config');
const commonResponse = require('./common.response.js')
const message = require('./../../message.js')
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { methods: commonServices, pincodeExist } = require('../../../services/common');

const User = db.users;


// register user
exports.registerUser = async (req, res) => {
    try {
        const isExist = await commonServices.get(User, { where: { phone_no: req.body.phone_no } })
        if (isExist) {
            return res.status(200).json({ success: false, message: message.DATA_EXIST("This mobile no") })
        }
        const slug = await commonServices.generateSlug(req.body.full_name)
        const password = await commonServices.generateHashPassword(req.body.password)

        const obj = {
            role_id: 2,
            slug: slug,
            full_name: req.body.full_name,
            email: req.body.email,
            countryCode: req.body.countryCode,
            phone_no: req.body.phone_no,
            profile_image: req.body.profile_image,
            password: password,
            is_active: 1
        }
        const data = await commonServices.create(User, obj)
        if (data) {
            res.status(200).json({ success: true, message: message.ADD_DATA("Your profile") })
        } else {
            res.status(200).json({ success: false, message: message.CREATE_FAILD("Your profile") })
        }
    } catch (error) {
        res.status(200).json({ success: false, message: error.message })
    }
};

// admin Login
exports.loginUser = async (req, res) => {
    try {
        const phone_no = req.body.phone_no;
        const pwd = req.body.password;
        const query = { where: [{ role_id: { [Op.or]: [2] } }, { phone_no: phone_no }, { is_active: 1 }] };

        const isExisting = await commonServices.get(User, query)
        console.log(isExisting.id);
        // return
        if (isExisting) {
            let passwordValidate = await commonServices.passwordCompare(pwd, isExisting.password);

            let token = await commonServices.generateToken(isExisting.id, isExisting.role_id);

            if (passwordValidate == true) {
                res.status(200).json({
                    success: "true",
                    message: message.LOGIN_SUCCESS,
                    data: commonResponse.logInRes({ isExisting, token }),
                });
            } else {
                res.status(200).json({ success: "false", message: message.INVALID("Password") });
            }
        } else {
            res.status(200).json({ success: "false", message: message.NO_DATA("User") });
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: "false", message: error.message })
    }

};

// User Logout
exports.userLogout = async (req, res) => {

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
exports.updateUser = async (req, res) => {
    try {
        const obj = {
            full_name: req.body.full_name,
            email: req.body.email,
            countryCode: req.body.countryCode,
            phone_no: req.body.phone_no,
            profile_image: req.body.profile_image
        }
        // const data = await User.update(obj, { where: { id: req.user.id } });
        console.log(obj);
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
exports.getUserById = async (req, res) => {
    try {
        const data = req.user
        const response = commonResponse.modifyUserRes(data);
        res.status(200).json({ success: true, message: message.GET_DATA("Your profile"), data: response })
    } catch (error) {
        res.status(200).json({ success: false, message: error.message })
    }
};