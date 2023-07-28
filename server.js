const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Route for the home page
app.get('/', (req, res) => {
  const subjects = JSON.parse(fs.readFileSync('subjects.json', 'utf8'));
  res.render('index', { title: 'Study - Zone', subjects });
});

// Route for adding a subject
app.post('/addSubject', (req, res) => {
  const newSubject = req.body.subject;
  const subjects = JSON.parse(fs.readFileSync('subjects.json', 'utf8'));
  subjects.push(newSubject);
  fs.writeFileSync('subjects.json', JSON.stringify(subjects));
  // Create an empty JSON file for the new subject
  fs.writeFileSync(`${newSubject}.json`, JSON.stringify([]));
  res.redirect('/');
});

// Route for the notes page of a subject
app.get('/notes/:subject', (req, res) => {
  const subject = req.params.subject;
  let notes = [];
  try {
    notes = JSON.parse(fs.readFileSync(`${subject}.json`, 'utf8'));
  } catch (err) {
    // If the JSON file does not exist for the subject, create an empty array
    fs.writeFileSync(`${subject}.json`, JSON.stringify([]));
  }
  res.render('notes', { subject, notes });
});

// Route for adding notes to a subject
app.post('/addNotes/:subject', (req, res) => {
  const subject = req.params.subject;
  const newNote = {
    content: req.body.note,
    isHeading: req.body.heading === 'true'
  };
  const notes = JSON.parse(fs.readFileSync(`${subject}.json`, 'utf8'));
  notes.push(newNote);
  fs.writeFileSync(`${subject}.json`, JSON.stringify(notes));
  res.redirect(`/notes/${subject}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
