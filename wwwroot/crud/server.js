const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5500;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = './data.json';

// Helper to read data file
function readDataFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

// Helper to write to data file
function writeDataFile(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Fetch all items
app.get('/items', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err || !data) {
      console.error('Error reading data:', err);
      return res.json([]);
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      console.error('Error parsing data:', parseErr);
      res.json([]);
    }
  });
});


// Add a new item
app.post('/items', async (req, res) => {
  try {
    const items = await readDataFile();
    const newItem = { id: items.length ? items[items.length - 1].id + 1 : 1, ...req.body };
    items.unshift(newItem);
    await writeDataFile(items);
    res.status(201).json(newItem);
  } catch {
    res.status(500).send('Error writing data');
  }
});

// Update an item
app.put('/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const items = await readDataFile();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return res.status(404).send('Item not found');

    items[index] = { ...items[index], ...req.body };
    await writeDataFile(items);
    res.json(items[index]);
  } catch {
    res.status(500).send('Error updating data');
  }
});

// Delete an item
app.delete('/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const items = await readDataFile();
    const updatedItems = items.filter((item) => item.id !== id);
    await writeDataFile(updatedItems);
    res.status(204).send();
  } catch {
    res.status(500).send('Error deleting data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
