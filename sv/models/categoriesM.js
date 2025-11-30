const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../api/cats');
const fileName = 'cat.json';
const filePath = path.join(dataPath, fileName);

async function ensureDir() {
  try { await fs.access(dataPath); } 
  catch (err) { await fs.mkdir(dataPath, { recursive: true }); }
}

async function readData() {
  await ensureDir();
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
}

async function getAllItems() {
  return await readData();
}

async function getItemById(id) {
  const arr = await readData();
  return arr.find(item => String(item.id) === String(id)) || null;
}

module.exports = {
  getAllItems,
  getItemById
};