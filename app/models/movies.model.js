module.exports = (sequelize, Sequelize) => {
    const Movie = sequelize.define("movies", {
      movie_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      movie_poster: {
        type: Sequelize.STRING,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: false,        
      },
      movie_type: {
        type: Sequelize.STRING,
      },
      movie_duration: {
        type: Sequelize.STRING,
      },
      screen_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0
      },
      summery: {
        type: Sequelize.STRING,
        defaultValue: 0
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
  
    return Movie;
  };



  