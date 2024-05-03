
const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const cloudinary = require('../cloudinary'); // Cloudinary configuration
const Post = require('../models/post');
const { Op } = require('sequelize'); // For complex queries

// Setting up Multer to handle file uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

// Creating a new post 
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, desc, tag } = req.body;

    
    if (!title || !desc) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Uploading the image to Cloudinary
    let imageUrl = null; 
    if (req.file) {
      cloudinary.uploader.upload(file,
  { public_id: "image" }, 
  function(error, result) {imageUrl=result });
    }

    // Creating the new post
    const newPost = await Post.create({
      title,
      desc,
      tag,
      imageUrl, 
    });

    res.status(201).json(newPost); // Returning the created post
  } catch (error) {
    console.error('Error creating post:', error); 
    res.status(500).json({ error: 'Error creating post' }); 
  }
});






// To Get all posts with sorting, pagination, keyword, and tag filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, size = 10, sort = 'createdAt', order = 'DESC', keyword, tag } = req.query;

    // Pagination and sorting
    const limit = parseInt(size); // Items per page
    const offset = (parseInt(page) - 1) * limit;

    
    const where = {};

    
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${keyword}%` } },
        { desc: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    
    if (tag) {
      where.tag = tag;
    }

    const posts = await Post.findAndCountAll({
      where, 
      limit,
      offset,
      order: [[sort, order.toUpperCase()]], 
    });

    res.json({
      totalItems: posts.count,
      totalPages: Math.ceil(posts.count / limit),
      currentPage: parseInt(page),
      posts: posts.rows,
    });
  } catch (error) {
    console.error('Error fetching posts:', error); 
    res.status(500).json({ error: 'Internal server error' }); 
  }
});


module.exports = router;
