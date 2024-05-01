module.exports = (sequelize, Sequelize) => {
  const SeatingArragement = sequelize.define("seating_arragements", {
    movie_id: {
      type: Sequelize.INTEGER,
    },
    show_time_id: {
      type: Sequelize.STRING,
    },
    seat_no: {
      type: Sequelize.INTEGER,
    },
    screen_no: {
      type: Sequelize.INTEGER,
    },
    is_vacant: {
      type: Sequelize.BOOLEAN,
    },
    createdBy: {
      type: Sequelize.INTEGER,
    },
    updatedBy: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
  }, { paranoid: true });

  return SeatingArragement;
};



