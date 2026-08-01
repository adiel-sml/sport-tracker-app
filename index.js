const express = require('express');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/seances', async (req, res) => {
  const { date, type, duree_minutes, notes } = req.body;
  const result = await pool.query(
    'INSERT INTO seances (date, type, duree_minutes, notes) VALUES ($1, $2, $3, $4) RETURNING *',
    [date, type, duree_minutes, notes]
  );
  res.status(201).json(result.rows[0]);
});

app.get('/seances', async (req, res) => {
  const result = await pool.query('SELECT * FROM seances ORDER BY date DESC');
  res.json(result.rows);
});

app.get('/seances/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM seances WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Séance non trouvée' });
  }
  res.json(result.rows[0]);
});

app.delete('/seances/:id', async (req, res) => {
  const result = await pool.query('DELETE FROM seances WHERE id = $1 RETURNING *', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Séance non trouvée' });
  }
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
