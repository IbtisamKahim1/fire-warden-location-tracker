const express = require('express');
const cors = require('cors');
const { poolPromise, sql } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// GET all fire warden records
app.get('/api/wardens', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM FireWardens');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ✅ POST to insert new warden
app.post('/api/wardens', async (req, res) => {
  try {
    const { staffNumber, firstName, lastName, location } = req.body;

    const pool = await poolPromise;
    await pool.request()
      .input('staffNumber', sql.VarChar(20), staffNumber)
      .input('firstName', sql.VarChar(100), firstName)
      .input('lastName', sql.VarChar(100), lastName)
      .input('location', sql.VarChar(100), location)
      .query(`
        INSERT INTO FireWardens (staffNumber, firstName, lastName, location, submittedAt)
        VALUES (@staffNumber, @firstName, @lastName, @location, GETDATE())
      `);      

    res.status(201).json({ message: 'Warden location submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.delete('/api/wardens/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .query(`DELETE FROM FireWardens WHERE id = @id`);
  
      res.status(200).json({ message: 'Warden deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // ✅ PUT to update existing warden
app.put('/api/wardens/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { staffNumber, firstName, lastName, location } = req.body;
  
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .input('staffNumber', sql.VarChar(20), staffNumber)
        .input('firstName', sql.VarChar(100), firstName)
        .input('lastName', sql.VarChar(100), lastName)
        .input('location', sql.VarChar(100), location)
        .query(`
          UPDATE FireWardens
          SET staffNumber = @staffNumber,
              firstName = @firstName,
              lastName = @lastName,
              location = @location
          WHERE id = @id
        `);
  
      res.status(200).json({ message: 'Warden updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const path = require('path');

// Serve static files from React
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
