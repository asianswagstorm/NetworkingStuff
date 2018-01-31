/**
 * Created by Andy on 2018-01-28.
 */
console.log('Starting notes.js');
function addNote(title,body)  {
    console.log('Adding note', title,body);
}

function getNote(title)  {
    console.log('Getting note', title);
}

function removeNote(title)  {
    console.log('Removing note', title);
}

function getAll()  {
    console.log('Getting all notes');
}

module.exports = {
    addNote,
    getAll,
    getNote,
    removeNote
};
