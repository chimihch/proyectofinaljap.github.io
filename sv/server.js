const express = require('express'); 
const cors = require('cors'); 

const productRoutes = require('./routes/cats_products'); 
const catRoutes = require('./routes/categories');
const pInfoRoutes = require('./routes/products')
const comments = require('./routes/products_comments')

const users = require('./users')

const app = express(); 
const PORT = 3000; 

// Middlewares 
app.use(cors()); // Permitir peticiones desde el frontend 
app.use(express.json()); // Parsear JSON en el body 
app.use(express.static('.')); // Servir archivos estáticos 


app.use('/products', productRoutes);
app.use('/categories', catRoutes);
app.use('/product_info', pInfoRoutes);
app.use('/products_comments', comments);

app.use('/users', users);

// Iniciar servidor 
app.listen(PORT, () => { 
    console.log(`Servidor corriendo en http://localhost:${PORT}`); 
    console.log('GET, PUT, DELETE /products/:id || /product_info/:id || /products_comments/:id');
    console.log('GET, POST /products || /product_info || /products_comments');
    console.log('GET /categories || /categories/:id');
    console.log('POST /users/login');
}); 

