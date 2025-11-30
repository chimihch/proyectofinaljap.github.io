const productModel = require('../models/productsM'); 

const handleError = (res, error, status = 500, message = 'Error del servidor') => { 
  console.error(error); 
  res.status(status).json({ success: false, message }); 
}; 
// Obtener todos los items 
const getAll = async (req, res) => { 
    try { 
        const items = await productModel.getAllItems(); 
        res.json(items); 
    } catch (error) { 
        handleError(res, error); 
    } 
}; 
// Obtener un item específico 
const getById = async (req, res) => { 
    try { 
        const item = await productModel.getItemById(req.params.id); 
        if (!item) return res.status(404).json({ success: false, message: 'No encontrado' }); 
        res.json(item); 
    } catch (error) { 
        handleError(res, error); 
    } 
}; 
// Crear un nuevo item 
const create = async (req, res) => { 
    try { 
        const created = await productModel.addItem(req.body || {}); 
        res.status(201).json(created); 
    } catch (error) { 
        handleError(res, error); 
    } 
}; 
// Actualizar un item existente 
const update = async (req, res) => { 
    try { 
        const updated = await productModel.updateItem(req.params.id, req.body || {}); 
        if (!updated) return res.status(404).json({ success: false, message: 'No encontrado' }); 
        res.json(updated); 
    } catch (error) { 
        handleError(res, error); 
    } 
}; 
// Eliminar un item 
const remove = async (req, res) => { 
    try { 
        const ok = await productModel.deleteItem(req.params.id); 
        if (!ok) return res.status(404).json({ success: false, message: 'No encontrado' }); 
        res.json({ success: true, message: 'Eliminado' }); 
    } catch (error) { 
        handleError(res, error); 
    } 
}; 
module.exports = { 
    getAll, 
    getById, 
    create, 
    update, 
    remove 
};