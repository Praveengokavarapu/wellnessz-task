
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); 
// Initializing Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_FILE, 
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

