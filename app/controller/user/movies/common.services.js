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

}