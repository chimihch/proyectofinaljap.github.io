const express = require('express');
const router = express.Router(); 
const productController = require('../controllers/categoriesC.js'); 

router.get('/', productController.getAll);
router.get('/:id', productController.getById); 

module.exports = router;