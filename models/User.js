const Rating = require("./Rating");
const Movie = require("./Movie");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { DataTypes, Op } = require("sequelize");
const sequelize = db.sequelize;

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        is: ["[a-z]", "i"],
        max: 30,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        max: 60,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8],
          msg: "password length must be more than 3 characters",
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        validatePasswordMatch(value) {
          if (value !== this.password) {
            throw new Error("Passwords do not match");
          }
        },
      },
    },
    role: { type: DataTypes.STRING, defaultValue: "user", allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "active" },
  },
  {
    indexes: [{ unique: true, fields: ["email"] }],
    hooks: {
      beforeFind: (options) => {
        options.where = {
          ...options.where,
          status: {
            [Op.not]: "inactive",
          },
        };
      },
    },
  }
);
User.beforeCreate(async (user, options) => {
  if (user.changed("password")) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    user.passwordConfirm = undefined;
  }
});

User.prototype.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

User.belongsToMany(Movie, { through: Rating });
Movie.belongsToMany(User, { through: Rating });

module.exports = User;
