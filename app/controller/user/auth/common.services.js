const { check, validationResult } = require("express-validator");

module.exports = {
  userRegisterValidation: [
    check('email').trim().not().isEmpty().withMessage("Email is required!").isEmail().withMessage('Invalid email!').bail(),
    check('countryCode').trim().not().isEmpty().withMessage("country code is required!").bail(),
    check('password').not().isEmpty().withMessage('Password is required!').bail().isLength({ min: 5 }).withMessage('Password Should be atleast 5 character long!').bail(),
    check('phone_no').not().isEmpty().withMessage('phone no is required!').bail().isLength({ min: 10 }).withMessage('phone no Should be atleast 10 character long!').bail(),

    (req, res, next) => {
      const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
      };
      const result = validationResult(req).formatWith(errorFormatter);
      if (!result.isEmpty()) {
        return res.status(422).json({ "success": "false", "message": result.array().join(", ") });
      }
      next();
    },
  ],

  userLoginValidation: [
    check('phone_no').trim().not().isEmpty().withMessage("phone is required!").bail(),
    check('password').not().isEmpty().withMessage('Password is required!').bail().isLength({ min: 5 }).withMessage('Password Should be atleast 5 character long!').bail(),

    (req, res, next) => {
      const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
      };
      const result = validationResult(req).formatWith(errorFormatter);
      if (!result.isEmpty()) {
        return res.status(422).json({ "success": "false", "message": result.array().join(", ") });
      }
      next();
    },
  ],

  emailValidation: [
    check('email').trim().isEmail().withMessage('Invalid email!').bail(),
    (req, res, next) => {
      const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
      };
      const result = validationResult(req).formatWith(errorFormatter);
      if (!result.isEmpty()) {
        return res.status(422).json({ "success": "false", "message": result.array().join(", ") });
      }
      next();
    }
  ],
  forgotePasswordValidation: [
    check('newPassword').not().isEmpty().withMessage('Password is required!').bail().isLength({ min: 6 }).withMessage('Password Should be atleast 6 character long!').bail()
      .custom((value, { req, loc, path }) => {
        if (value != req.body.confirmNewPassword) {
          throw new Error("New password and confirm new password doesn't match!");
        } else {
          return value;
        }
      }),
    (req, res, next) => {
      const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
      };
      const result = validationResult(req).formatWith(errorFormatter);
      if (!result.isEmpty()) {
        return res.status(422).json({ "success": "false", "message": result.array().join(", ") });
      }
      next();
    }
  ],
  changePasswordValidation: [
    check('oldPassword').not().isEmpty().withMessage('Old password is required!').bail(),
    check('newPassword').not().isEmpty().withMessage('Password is required!').bail().isLength({ min: 6 }).withMessage('Password Should be atleast 6 character long!').bail()
      .custom((value, { req, loc, path }) => {
        if (value != req.body.confirmNewPassword) {
          throw new Error("New password and confirm new password doesn't match!");
        } else {
          return value;
        }
      }),
    (req, res, next) => {
      const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
      };
      const result = validationResult(req).formatWith(errorFormatter);
      if (!result.isEmpty()) {
        return res.status(422).json({ "success": "false", "message": result.array().join(", ") });
      }
      next();
    }
  ],

}