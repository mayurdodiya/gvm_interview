const db = require('../../../models/index.js');
const otherConfig = require('../../../config/other.config.js');
const commonResponse = require('./common.response.js')
const message = require('../../message.js')
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { methods: commonServices, pincodeExist } = require('../../../services/common.js');
const { methods: contentServices } = require("../../../services/content")

const User = db.users;
const Movies = db.movies;
const Showtimes = db.showtimes;
const SeatingArragements = db.seating_arragements;





// add movies
exports.addMovies = async (req, res) => {
    try {
        const user = req.user
        const adminId = req.user.id
        console.log(user);

        const isExist = await commonServices.get(Movies, { where: { movie_title: req.body.movie_title } })
        if (isExist) {
            return res.status(200).json({ success: false, message: message.DATA_EXIST("This movie") })
        }
        const t = await db.sequelize.transaction()

        try {
            let userData = await contentServices.createMovie({ adminId, ...req.body }, t)
            await t.commit()
            return res.status(200).json({ success: "true", message: message.ADD_DATA("Movie") })

        } catch (error) {
            console.log(error);
            await t.rollback()
            return res.status(200).json({ success: "false", message: error.message })
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: false, message: error.message })
    }
};

// add seating arragement
exports.addSeatingArragement = async (req, res) => {
    try {
        const user = req.user
        const adminId = req.user.id
        const query = {
            where: [{ movie_id: req.body.movie_id }, { show_time_id: req.body.show_time_id }, { screen_no: req.body.screen_no }]
        }
        const isExist = await commonServices.get(SeatingArragements, query)
        if (isExist != null) {
            return res.status(200).json({ success: "false", message: message.DATA_EXIST("This details") })
        }

        const t = await db.sequelize.transaction()
        try {
            let data = await contentServices.addSeatArragment({ adminId, ...req.body }, t)
            await t.commit()
            return res.status(200).json({ success: "true", message: message.ADD_DATA("Seating") })

        } catch (error) {
            console.log(error);
            await t.rollback()
            return res.status(200).json({ success: "false", message: error.message })
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: false, message: error.message })
    }
};

// edit movie details
exports.updteMovies = async (req, res) => {
    try {
        const adminId = req.user.id;
        const movieId = req.params.id;

        const isExist = await commonServices.get(Movies, { where: [{ movie_title: { [Op.ne]: req.body.movie_title } }, { movie_title: req.body.movie_title }] })
        if (isExist) {
            return res.status(200).json({ success: false, message: message.DATA_EXIST("This movie") })
        }

        const t = await db.sequelize.transaction()
        try {
            await contentServices.updateMovieDetails({ adminId, movieId, ...req.body }, t);
            return res.status(200).json({ success: "true", message: message.UPDATE_PROFILE("Movie") })

        } catch (error) {
            console.log(error);
            await t.rollback()
            return res.status(200).json({ success: "false", message: error.message })
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: false, message: error.message })
    }
};

// delete movie by id
exports.deleteMovieById = async (req, res) => {
    try {

        const movieId = req.params.id
        const user = await commonServices.get(Movies, { where: { id: movieId } })
        if (!user) {
            return res.status(200).json({ success: "false", message: message.NO_DATA("This movie") });
        }

        const t = await db.sequelize.transaction();
        try {
            await contentServices.deleteMovieDetails({ movieId }, t)
            await t.commit()
            return res.status(200).json({ success: "true", message: message.DELETED_SUCCESS("Movie") })
        } catch (error) {
            console.log(error);
            await t.rollback()
            return res.status(200).json({ success: "false", message: error.message })
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: "false", message: error.message });
    }
};

// view movie by id
exports.getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;
        const query = {
            where: { id: movieId },
            attributes: ["id", "movie_title", "movie_poster", "language", "movie_type", "movie_duration", "screen_type", "summery", "createdBy", "createdAt"],
            include: [
                {
                    model: Showtimes, as: "movie_showtime", attributes: ["id", "movie_id", "show_time"],
                },
            ]
        }


        const data = await commonServices.get(Movies, query)
        if (data) {
            res.status(200).json({ success: true, message: message.GET_DATA("Movie"), data: data })
        } else {
            res.status(200).json({ success: false, message: message.NOT_UPDATE("Movie") })
        }
    } catch (error) {
        res.status(200).json({ success: false, message: error.message })
    }
};

// view all movie
exports.viewAllMovies = async (req, res) => {

    try {
        const { page, size, s } = req.query;

        let DataObj = {};
        if (s) {
            DataObj = {
                ...DataObj,
                [Op.or]: [
                    { id: { [Op.like]: `%${s}%` } },
                    { movie_title: { [Op.like]: `%${s}%` } },
                    { movie_type: { [Op.like]: `%${s}%` } },
                ]
            }
        }

        const { limit, offset } = commonServices.getPagination(page, size);
        let query = {
            where: [DataObj],
            attributes: ['id', 'movie_title', 'movie_poster', 'language', 'movie_type', 'movie_duration', 'screen_type', 'summery', 'createdAt'],
        };

        let data = await commonServices.getAndCountAll(Movies, query, limit, offset)

        if (data) {

            const response = commonServices.getPagingData(data, page, limit);
            let responseData = JSON.parse(JSON.stringify(response))

            res.status(200).json({
                success: "true",
                message: message.GET_DATA("Movie"),
                data: responseData
            })
        } else {
            res.status(200).json({ success: "false", message: message.NO_DATA("Movie") })
        }


    } catch (error) {
        res.status(200).json({ success: " false", message: error.message })
    }

};


// movie dropdown
exports.viewAllMoviesDropdown = async (req, res) => {

    try {
        let query = {
            where: [],
            attributes: ['id', 'movie_title'],
        };

        let data = await commonServices.getAll(Movies, query)

        if (data) {
            res.status(200).json({ success: "true", message: message.GET_DATA("Movie"), data: data })
        } else {
            res.status(200).json({ success: "false", message: message.NO_DATA("Movie") })
        }


    } catch (error) {
        res.status(200).json({ success: " false", message: error.message })
    }

};

// show times dropdown
exports.viewMoviesAllShowtimesDropdown = async (req, res) => {

    try {
        const movieId = req.body.movie_id;
        let query = {
            where: [{ movie_id: movieId }],
            attributes: ['id', 'show_time'],
        };

        let data = await commonServices.getAll(Showtimes, query)

        if (data) {
            res.status(200).json({ success: "true", message: message.GET_DATA("Movie"), data: data })
        } else {
            res.status(200).json({ success: "false", message: message.NO_DATA("Movie") })
        }


    } catch (error) {
        res.status(200).json({ success: " false", message: error.message })
    }

};