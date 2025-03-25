const express = require('express');
const router = express.Router();
const db = require('../db');

// Log kaydet
router.post('/', async (req, res) => {
  const { user_id, medication_id, date, taken_times, dose_taken } = req.body;

  try {
    await db.query(
      `INSERT INTO medication_logs (user_id, medication_id, date, taken_times, dose_taken)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, medication_id, date)
       DO UPDATE SET taken_times = $4, dose_taken = $5`,
      [user_id, medication_id, date, taken_times, dose_taken]
    );
    res.status(201).send('Log saved');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving log');
  }
});

// Belirli günün loglarını getir
router.get('/', async (req, res) => {
  const { user_id, date } = req.query;

  const result = await db.query(
    `SELECT ml.*, m.name, m.label FROM medication_logs ml
     JOIN medications m ON ml.medication_id = m.id
     WHERE ml.user_id = $1 AND ml.date = $2`,
    [user_id, date]
  );

  res.json(result.rows);
});

module.exports = router;