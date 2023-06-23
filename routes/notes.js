//ROUTES FOR NOTES 
const notes = require('express').Router();
const uuid = require('../helpers/uuid');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

notes.get("/", (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});


notes.post('/', (req, res) => {
    console.info(`${req.method} request received to save to NoteTaker app`);

    const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            title,
            text,
            noteID: uuid(),
        };
        readAndAppend(newNote, './db/db.json');
        res.json(`Note saved successfully`);
    } else {
        res.json(`Error`)
    }
});

notes.get('/:noteID', (req, res) => {
    const id = req.params.noteID;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.noteID === id);
            return result.length > 0
                ? res.json(result)
                : res.json('Note not found');
        });
});

/*
notes.delete('/:noteID', (req, res) => {
    const id = req.params.noteID;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.noteID != id);
            writeToFile('./db/db.json', result);
            res.json(`Note has been deleted`);
        });
});
*/


module.exports = notes;
