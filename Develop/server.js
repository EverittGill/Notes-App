// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column


const express = require('express');
const fs = require('fs')
const path = require('path')
const { clog } = require('./middleware/clog')
const api = require('./routes.index.js')

const PORT = process.env.PORT || 3001;

const app = express()

// from the mini challenge. use as needed
// // Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);
app.use(express.static('public'));





// GET /notes should return the notes.html file
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


// get * should return the index.html file
// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);





// GET /api/notes should read the db.json file and return all the saved notes as JSON
app.get('/api/notes', (req, res) => res.json(termData));


// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
  // Read the existing notes from the db.json file
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send({ error: 'Error reading the db.json file' });
    }

    let notes;
    try {
      notes = JSON.parse(data);
    } catch (error) {
      return res.status(500).send({ error: 'Error parsing the db.json file' });
    }

    // Add the new note to the existing notes
    const newNote = req.body;
    notes.push(newNote);

    // Write the updated notes to the db.json file
    fs.writeFile('db.json', JSON.stringify(notes), (err) => {
      if (err) {
        return res.status(500).send({ error: 'Error writing to the db.json file' });
      }

      // Return the new note to the client
      return res.status(201).send(newNote);
    });
  });
});
