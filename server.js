import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let db;

// Initialize database
async function initDb() {
  db = await open({
    filename: path.join(__dirname, 'habits.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      done INTEGER DEFAULT 0,
      val INTEGER DEFAULT 0,
      icon TEXT,
      date TEXT NOT NULL
    );
  `);
}

// Get habits for a specific date
app.get('/api/habits/:date', async (req, res) => {
  try {
    const habits = await db.all('SELECT * FROM habits WHERE date = ?', [req.params.date]);
    res.json(habits || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save or update habits
app.post('/api/habits/:date', async (req, res) => {
  try {
    const { habits } = req.body;
    const date = req.params.date;

    // Clear existing habits for this date
    await db.run('DELETE FROM habits WHERE date = ?', [date]);

    // Insert new habits
    for (const h of habits) {
      await db.run(
        'INSERT INTO habits (id, name, type, done, val, icon, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [h.id, h.name, h.type, h.done ? 1 : 0, h.val || 0, h.icon || '', date]
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stats for a date range
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.all(`
      SELECT date, COUNT(*) as total, SUM(done) as completed
      FROM habits
      GROUP BY date
      ORDER BY date DESC
      LIMIT 30
    `);
    res.json(stats || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  await initDb();
  console.log(`Server running on http://localhost:${PORT}`);
});
