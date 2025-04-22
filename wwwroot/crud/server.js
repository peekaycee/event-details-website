const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const moment = require('moment');


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

app.get('/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "events" ORDER BY "id" DESC');
    
    const formattedEvents = result.rows.map(event => ({
      ...event,
      date: moment(event.date).format('YYYY-MM-DD') // or any format like 'MMMM Do YYYY'
    }));

    res.json(formattedEvents);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Unable to fetch events' });
  }
});

// POST new event
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

// PUT update event
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

// DELETE event
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
