const db = require('../models');
const { methods: commonServices } = require("./common");
const options = require("../config/options");
const moment = require('moment');
const Sequelize = require("sequelize");
const Op = db.Sequelize.Op;

const User = db.users;
const Movies = db.movies;
const Showtimes = db.showtimes;
const SeatingArragements = db.seating_arragements;


const methods = {
	createMovie: async (data, transaction) => {
		try {
			const addMovie = await commonServices.create(Movies, {
				movie_title: data.movie_title,
				movie_poster: data.movie_poster,
				language: data.language,
				movie_type: data.movie_type,
				movie_duration: data.movie_duration,
				screen_type: data.screen_type,
				summery: data.summery,
				createdBy: data.adminId
			}, { transaction })
			if (!addMovie) {
				await t.rollback()
				return false
			}

			const movieDetailArray = data.showdetails.map(i => {
				return {
					movie_id: addMovie.id,
					show_time: i.show_time,
					createdBy: data.adminId
				}
			})
			const addMovieDetails = await commonServices.bulkCreate(Showtimes, movieDetailArray, { transaction })
			if (!addMovieDetails) {
				await t.rollback()
				return false
			}


			return addMovie
		} catch (error) {
			console.log(error)
			await transaction.rollback()
			throw error
		}
	},
	updateMovieDetails: async (data, transaction) => {
		try {
			const updateMovie = await commonServices.update(Movies, { where: { id: data.movieId } }, {
				movie_title: data.movie_title,
				movie_poster: data.movie_poster,
				language: data.language,
				movie_type: data.movie_type,
				movie_duration: data.movie_duration,
				screen_type: data.screen_type,
				summery: data.summery,
				updatedBy: data.adminId
			}, { transaction })
			if (!updateMovie) {
				await t.rollback()
				return false
			}

			if (data.showdetails) {

				//delete data
				var deleteData = data.showdetails.filter(function (o) { return o.hasOwnProperty("is_deleted"); })
				const deleteId = deleteData.map(item => {
					return item.id
				})
				await commonServices.delete(Showtimes, { where: { id: deleteId } });

				// update data
				var updateMoviesData = data.showdetails.filter(function (o) { return o.hasOwnProperty("is_edit"); })
				const updateMoviesIdArr = updateMoviesData.map(item => {
					return item.id
				})
				for (let j = 0; j < updateMoviesData.length; j++) {
					const moviesData = {
						show_time: updateMoviesData[j].show_time,
						updatedBy: data.adminId
					}
					await commonServices.update(Showtimes, { where: { id: updateMoviesIdArr[j] } }, moviesData, { transaction })
				}

			}

			return true
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	},
	deleteMovieDetails: async (data, transaction) => {
		try {
			const deleteMovies = await commonServices.delete(Movies, { where: { id: data.movieId } }, { transaction })
			if (!deleteMovies) {
				await transaction.rollback()
				return false
			}
			// const deleteDoctorsEducations = await commonServices.delete(DoctorsEducations, { where: { doctor_id: data.doctorId } }, { transaction })
			// if (!deleteDoctorsEducations) {
			// 	await transaction.rollback()
			// 	return false
			// }

			const deleteShowtimes = await commonServices.delete(Showtimes, { where: { movie_id: data.movieId } }, { transaction })

			return true
		} catch (error) {

			await transaction.rollback()
			throw error
		}
	},
	addSeatArragment: async (data, transaction) => {
		try {
			const seatingDetailArray = data.seat.map(i => {
				return {
					movie_id: data.movie_id,
					show_time_id: data.show_time_id,
					seat_no: i.seat_no,
					screen_no: data.screen_no,
					is_vacant: 1,
					createdBy: data.adminId,
				}
			})
			const addSeatingDetails = await commonServices.bulkCreate(SeatingArragements, seatingDetailArray, { transaction })
			if (!addSeatingDetails) {
				await t.rollback()
				return false
			}


			return addSeatingDetails
		} catch (error) {
			console.log(error)
			await transaction.rollback()
			throw error
		}
	},
}


module.exports = { methods }