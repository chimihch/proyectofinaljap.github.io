const express = require('express'); 
const cors = require('cors'); 

const productRoutes = require('./routes/cats_products'); 
const catRoutes = require('./routes/categories');
const pInfoRoutes = require('./routes/products')
const comments = require('./routes/products_comments')

const app = express(); 
const PORT = 3000; 

// Middlewares 
app.use(cors()); // Permitir peticiones desde el frontend 
app.use(express.json()); // Parsear JSON en el body 
app.use(express.static('.')); // Servir archivos estáticos 

// Usar las rutas de items con prefijo /items 
app.use('/products', productRoutes);
app.use('/categories', catRoutes);
app.use('/product_info', pInfoRoutes);
app.use('/products_comments', comments);

// Iniciar servidor 
app.listen(PORT, () => { 
    console.log(`Servidor corriendo en http://localhost:${PORT}`); 
}); 

