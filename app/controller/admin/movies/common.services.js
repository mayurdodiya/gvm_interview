const { check, validationResult } = require("express-validator");

module.exports = {
  addMoviesValidation: [
    check('movie_title').trim().not().isEmpty().withMessage("movie title is required!").bail(),
    check('language').not().isEmpty().withMessage('language is required!').bail(),
    check('movie_type').not().isEmpty().withMessage('movie_type is required!').bail(),
    check('movie_duration').not().isEmpty().withMessage('movie duration is required!').bail(),
    check('screen_type').not().isEmpty().withMessage('screen type is required!').bail(),


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
  addSeatingValidation: [
    check('movie_id').trim().not().isEmpty().withMessage("movie name is required!").bail(),
    check('show_time_id').not().isEmpty().withMessage('show time is required!').bail(),
    check('seat').not().isEmpty().withMessage('seat no is required!').bail(),


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
  showTimeDropDownValidation: [
    check('movie_id').trim().not().isEmpty().withMessage("movie id(name) is required!").bail(),


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

}