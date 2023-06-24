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
            id: uuid(),
        };
        readAndAppend(newNote, './db/db.json');
        res.json(`Note saved successfully`);
    } else {
        res.json(`Error`)
    }
});

notes.get('/:id', (req, res) => {
    const noteID = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id === noteID);
            return result.length > 0
                ? res.json(result)
                : res.json('Note not found');
        });
});

notes.delete('/:id', (req, res) => {
    const noteID = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id != noteID);
            writeToFile('./db/db.json', result);
            res.json(`Note has been deleted`);
        });
});



module.exports = notes;
