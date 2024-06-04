
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const db = require('./models/index'); // Sequelize database setup
const postsRouter = require('./routes/posts'); // Posts route

dotenv.config(); // Loading environment variables from .env

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Initializing the database and synchronize tables
db.sequelize.sync({ force: true }) 
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });

// Adding routes
app.use('/api/posts', postsRouter); // Connecting the posts router to the '/api/posts' endpoint

// Starting the server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

