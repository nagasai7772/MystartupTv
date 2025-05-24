const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
require('dotenv').config()
const app = express();
const port =process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// File path to store form data
const filePath = path.join(__dirname, 'formData.json');

// Helper function to ensure file exists
function ensureFileExists() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8'); // Initialize with empty array
  }
}

// POST route to handle form submission
// app.post('/submit', (req, res) => {
//   const formData = req.body;

//   // Ensure JSON file exists
//   ensureFileExists();

//   try {
//     // Read existing data
//     const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

//     // Append new data
//     existingData.push(formData);

//     // Write updated data back to file
//     fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');

//     res.status(200).json({ message: 'Form submitted and saved successfully!' });
//   } catch (error) {
//     console.error('Error writing to file:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
app.post('/submit', (req, res) => {
  const formData = req.body;

  ensureFileExists();

  try {
    let existingData = [];

    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8').trim();

    if (fileContent) {
      try {
        existingData = JSON.parse(fileContent);
        if (!Array.isArray(existingData)) {
          existingData = [];
        }
      } catch (parseErr) {
        console.error('Error parsing JSON file:', parseErr);
        // Reset to empty array if parse error
        existingData = [];
      }
    }

    existingData.push(formData);

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');

    res.status(200).json({ message: 'Form submitted and saved successfully!' });
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running successfully `);
});
