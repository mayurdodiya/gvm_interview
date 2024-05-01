const otherConfig = require('../config/other.config')
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const options = require("../config/options")
const db = require('../models');
const message = require("./message");
const Op = db.Sequelize.Op;

const User = db.users;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).json({
            success: "false",
            message: message.Auth.TOKEN_EXPIRED
        });
    }
    return res.status(401).json({
        success: "false",
        message: message.Auth.BAD_REQUEST
    });
}



exports.verifyAdminToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).json({
            success: "false",
            message: message.Auth.NO_TOKEN
        });
    }
    jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
        if (err) { return catchError(err, res) }
        User.findOne({ where: [{ id: decoded.user_id }, [{ role_id: { [Op.or]: [1, 2] } }]] }).then((user) => {
            if (user) {
                req.user = user
                next();
            } else {
                return res.status(403).json({
                    success: "false",
                    message: message.Auth.BAD_REQUEST
                });
            }
        }).catch(err => {
            return res.status(403).json({
                success: "false",
                message: message.Auth.BAD_REQUEST || err
            });
        })
    });
};


exports.verifyUserToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).json({
        success: "false",
        message: message.Auth.NO_TOKEN
      });
    }
    jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
      if (err) { return catchError(err, res); }
      User.findOne({
        where: [{ id: decoded.user_id }, { role_id: 2 }, { is_active: 1 }],
      }).then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          return res.status(403).json({
            success: "false",
            message: message.Auth.NO_USER
          });
        }
      }).catch(err => {
  
        return res.status(403).json({
          success: "false",
          message: message.Auth.BAD_REQUEST || err
        });
      })
    });
  };
  