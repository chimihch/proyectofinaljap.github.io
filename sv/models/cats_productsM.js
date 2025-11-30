const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../api/cats_products');

async function ensureDir() {
  try { await fs.access(dataPath); } 
  catch (err) { await fs.mkdir(dataPath, { recursive: true }); }
}

async function getAllItems() {
  await ensureDir();
  const files = await fs.readdir(dataPath);
  const items = [];
  for (const file of files) {
    if (path.extname(file) !== '.json') continue;
    try {
      const content = await fs.readFile(path.join(dataPath, file), 'utf8');
      items.push(JSON.parse(content));
    } catch (e) {
      console.warn('filtrando archivos invalidos:', file);
    }
  }
  return items;
}

async function getItemById(id) {
  await ensureDir();
  const filePath = path.join(dataPath, `${id}.json`);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

async function saveItemToFile(id, item) {
  await ensureDir();
  const filePath = path.join(dataPath, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(item, null, 2), 'utf8');
}

async function addItem(item) {
  const all = await getAllItems();
  const numericIds = all.map(i => Number(i.id)).filter(n => !Number.isNaN(n));
  const nextId = numericIds.length ? Math.max(...numericIds) + 1 : 1;
  const id = item.id ? String(item.id) : String(nextId);
  const toSave = { ...item, id };
  await saveItemToFile(id, toSave);
  return toSave;
}

async function updateItem(id, updates) {
  const existing = await getItemById(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates, id: String(id) };
  await saveItemToFile(id, updated);
  return updated;
}

async function deleteItem(id) {
  const filePath = path.join(dataPath, `${id}.json`);
  try {
    await fs.unlink(filePath);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem
};