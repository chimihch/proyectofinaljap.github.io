const express = require('express'); 
const cors = require('cors'); 

const productRoutes = require('./routes/cats_products'); 
const catRoutes = require('./routes/categories');
const pInfoRoutes = require('./routes/products')
const comments = require('./routes/products_comments')

const users = require('./users')
const auth = require('./middleware/auth');  // <-- NUEVO

const app = express(); 
const PORT = 3000; 

// Middlewares 
app.use(cors()); 
app.use(express.json()); 
app.use(express.static('.')); 

// Rutas públicas (NO requieren token)
app.use('/users', users);

// Rutas protegidas (requieren token)
app.use('/products', auth, productRoutes);
app.use('/categories', auth, catRoutes);
app.use('/product_info', auth, pInfoRoutes);
app.use('/products_comments', auth, comments);

// Iniciar servidor 
app.listen(PORT, () => { 
    console.log(`Servidor corriendo en http://localhost:${PORT}`); 

    console.log(' ');
    console.log('POST /users/login');
    console.log('GET, PUT, DELETE /products/:id || /product_info/:id || /products_comments/:id');
    console.log('GET, POST /products || /product_info || /products_comments');
    console.log('GET /categories || /categories/:id');
    console.log(' ');
    console.log('Autorizacion POSTMAN: POSTeá el json especificado en el acta documental en /users/login y pegá el token');
    console.log('                      generado en la pestaña "Auth" -> type:"Bearer Token" para acceder a las rutas protegidas.')
});
