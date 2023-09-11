const db = require("../db");
const { DataTypes } = require("sequelize");
const User = require("./User");
const Movie = require("./Movie");
const sequelize = db.sequelize;

const Rating = sequelize.define("rating", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  movieId: {
    type: DataTypes.INTEGER,
  },
});

Rating.belongsTo(Movie, { foreignKey: "movieId" });

module.exports = Rating;
