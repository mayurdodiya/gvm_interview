const db = require('../../../models/index.js');
const otherConfig = require('../../../config/other.config.js');
const commonResponse = require('./common.response.js')
const message = require('../../message.js')
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { methods: commonServices, pincodeExist } = require('../../../services/common.js');

const User = db.users;
const Movies = db.movies;
const Showtimes = db.showtimes;
const SeatingArragements = db.seating_arragements;





// view movie by id
exports.getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;
        const query = {
            where: { id: movieId },
            attributes: ["id", "movie_title", "movie_poster", "language", "movie_type", "movie_duration", "screen_type", "summery", "createdAt"],
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

// view seating from show time's id  work in progress***
exports.viewAllSeatingOfShwosTime = async (req, res) => {

    try {
        const show_timeId = req.params.id;
        let query = {
            where: [{ id: show_timeId }],
            attributes: ['id', 'movie_id', 'show_time'],
        };

        let data = await commonServices.getAll(Showtimes, query)

        if (data) {
            res.status(200).json({ success: "true", message: message.GET_DATA("Show time"), data: data })
        } else {
            res.status(200).json({ success: "false", message: message.NO_DATA("Movie") })
        }


    } catch (error) {
        res.status(200).json({ success: " false", message: error.message })
    }

};