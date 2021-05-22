const express = require('express');
const path = require('path');
const fs = require('fs');
const noteDB = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 8600;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    return res.json(noteDB);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/api/notes', (req, res) => {
    let newNotes = req.body;
    let lastID = 0;

    for (let i = 0; i < noteDB; i++) {
        let noteID = noteDB[i];

        if (noteID.id > lastID) {
            lastID = noteID.id;
        }
    }

    newNotes.id = lastID + 1;

    noteDB.push(newNotes);

    fs.writeFile('./db/db.json', JSON.stringify(noteDB), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log('Note Saved!');
        }
    });

    res.json(newNotes);
});

app.delete('/api/notes/:id', (req, res) => {
    for (let i = 0; i < noteDB.length; i++) {

        if (noteDB[i].id == req.params.id) {
            noteDB.splice(i, 1);

        }
    }

    fs.writeFile('./db/db.json', JSON.stringify(noteDB), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log('Note Deleted!');
        }
    });

    res.json(noteDB);
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));