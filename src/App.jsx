import { useState, useEffect } from 'react'
import axios from 'axios';
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification';

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return(
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState('some error happened...');

  useEffect(() => {
    console.log('effect')
    noteService.getAll()
      .then(initialNotes => {
        const dummy = {
          "id": 555,
          "content": "Dummy entry",
          "important": false
        };
        setNotes(initialNotes.concat(dummy))
      })
  }, [])

  console.log('render', notes.length, 'notes');

  const addNote = (event) => {
    event.preventDefault();
    const noteToAdd = {
      content: newNote,
      important: Math.random() < 0.5
    }

    noteService.create(noteToAdd)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(x => x.id === id);
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(x => x.id !== id ? x : returnedNote))
      })
      .catch(error => {
        setErrorMessage(`The note '${note.content}' was not found on server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      });
  }

  const notesToShow = showAll ? notes : notes.filter(x => x.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App