const express = require('express');
const router = express.Router(); 
const productController = require('../controllers/cats_productsC.js'); 

// Definir las rutas y conectarlas con el controller 
router.get('/', productController.getAll);
router.get('/:id', productController.getById); 
router.post('/', productController.create); 
router.delete('/:id', productController.remove);
router.put('/:id', productController.update);

module.exports = router; 