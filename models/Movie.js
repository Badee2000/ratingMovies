const db = require("../db");
const { DataTypes } = require("sequelize");
const Rating = require("./Rating");
const User = require("./User");

const sequelize = db.sequelize;

const Movie = sequelize.define("movie", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Movie.belongsToMany(User, { through: Rating });

module.exports = Movie;
