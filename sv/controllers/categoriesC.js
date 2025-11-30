const catsModel = require('../models/categoriesM');

const getAll = async (req, res) => { 
    try {   
        const items = await catsModel.getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'eError al leer los datos' });
    }
};

const getById = async (req, res) => {
    try {
        const item = await catsModel.getItemById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos' });
    }
};

module.exports = {
    getAll,
    getById
};
