module.exports = (sequelize, Sequelize) => {
    const ShowTimes = sequelize.define("showtimes", {
      movie_id: {
        type: Sequelize.INTEGER,
      },
      show_time: {
        type: Sequelize.STRING,
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
  
    return ShowTimes;
  };



  