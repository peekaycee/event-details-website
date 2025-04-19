// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const cors = require('cors');

// const app = express();
// const PORT = 5500;

// app.use(cors());
// app.use(bodyParser.json());

// const DATA_FILE = './data.json';

// // Helper to read data file
// function readDataFile() {
//   return new Promise((resolve, reject) => {
//     fs.readFile(DATA_FILE, (err, data) => {
//       if (err) reject(err);
//       else resolve(JSON.parse(data));
//     });
//   });
// }

// // Helper to write to data file
// function writeDataFile(data) {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
//       if (err) reject(err);
//       else resolve();
//     });
//   });
// }

// // Fetch all items
// app.get('/items', (req, res) => {
//   fs.readFile(DATA_FILE, (err, data) => {
//     if (err || !data) {
//       console.error('Error reading data:', err);
//       return res.json([]);
//     }
//     try {
//       res.json(JSON.parse(data));
//     } catch (parseErr) {
//       console.error('Error parsing data:', parseErr);
//       res.json([]);
//     }
//   });
// });


// // Add a new item
// app.post('/items', async (req, res) => {
//   try {
//     const items = await readDataFile();
//     const newItem = { id: items.length ? items[items.length - 1].id + 1 : 1, ...req.body };
//     items.unshift(newItem);
//     await writeDataFile(items);
//     res.status(201).json(newItem);
//   } catch {
//     res.status(500).send('Error writing data');
//   }
// });

// // Update an item
// app.put('/items/:id', async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const items = await readDataFile();
//     const index = items.findIndex((item) => item.id === id);
//     if (index === -1) return res.status(404).send('Item not found');

//     items[index] = { ...items[index], ...req.body };
//     await writeDataFile(items);
//     res.json(items[index]);
//   } catch {
//     res.status(500).send('Error updating data');
//   }
// });

// // Delete an item
// app.delete('/items/:id', async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const items = await readDataFile();
//     const updatedItems = items.filter((item) => item.id !== id);
//     await writeDataFile(updatedItems);
//     res.status(204).send();
//   } catch {
//     res.status(500).send('Error deleting data');
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



// NEW CODEBASE


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5500;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL config
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'event-details-data',
  password: 'Peekay_007',
  port: 5432
});

// 🔹 GET all events
app.get('/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "events" ORDER BY "id" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Unable to fetch events' });
  }
});

// 🔹 POST new event
app.post('/events', async (req, res) => {
  const { imageUrl, videoUrl, title, description, location, date, fee } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO "events" ("imageUrl", "videoUrl", "title", "description", "location", "date", "fee")
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [imageUrl, videoUrl, title, description, location, date, fee]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding event:', err);
    res.status(500).json({ error: 'Unable to add event' });
  }
});

// 🔹 PUT update event
app.put('/events/:id', async (req, res) => {
  const idParam = parseInt(req.params.id);
  const { imageUrl, videoUrl, title, description, location, date, fee } = req.body;
  try {
    const result = await pool.query(
      `UPDATE "events" 
       SET "imageUrl" = $1, "videoUrl" = $2, "title" = $3, "description" = $4, "location" = $5, "date" = $6, "fee" = $7 
       WHERE "id" = $8 RETURNING *`,
      [imageUrl, videoUrl, title, description, location, date, fee, idParam]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Unable to update event' });
  }
});

// 🔹 DELETE event
app.delete('/events/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM "events" WHERE "id" = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Unable to delete event' });
  }
});

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
