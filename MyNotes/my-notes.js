const newNote = document.querySelector(".input");
const addNote = document.querySelector(".btn-add");
const noteList = document.querySelector(".note-list");

addNote.addEventListener("click", noteAdd);
noteList.addEventListener("click", deleteNote);
document.addEventListener("DOMContentLoaded", getLS);

function noteAdd(e)
{
    e.preventDefault();

    if (newNote.value.length > 1)
    {
        createNote(newNote.value);

        saveNoteToLocalStorage(newNote.value);
        newNote.value = "";
    }
    else
    {
        alert("You can't blank note!")
    }
}

function deleteNote(e)
{
    const clickingNote = e.target;

    if (clickingNote.classList.contains("completed-btn"))
    {
        clickingNote.parentElement.classList.toggle("note-completed");
    }
    if (clickingNote.classList.contains("del-btn"))
    {
        if(confirm("Are you sure?"))
        {
            clickingNote.parentElement.classList.toggle("del");

            const delNote = clickingNote.parentElement.children[0].innerText;
            clearLS(delNote);
            
            clickingNote.parentElement.addEventListener("transitionend", function() {
                clickingNote.parentElement.remove();
            });
        }
    }
}

function saveNoteToLocalStorage(newNote)
{
    let notes;

    if(localStorage.getItem("notes") === null)
    {
        notes = [];
    }
    else
    {
        notes = JSON.parse(localStorage.getItem("notes"));
    }

    notes.push(newNote);

    localStorage.setItem("notes", JSON.stringify(notes));
}

function getLS()
{
    let notes;

    if(localStorage.getItem("notes") === null)
    {
        notes = [];
    }
    else
    {
        notes = JSON.parse(localStorage.getItem("notes"));
    }

    notes.forEach(function(mission) {
        createNote(mission)
    })
}

function createNote(aNote)
{
    const notesDiv = document.createElement("div");
    notesDiv.classList.add("note-item");

    const notesLi = document.createElement("li");
    notesLi.classList.add("note")
    notesLi.innerText = aNote;
    notesDiv.appendChild(notesLi);

    noteList.appendChild(notesDiv);

    const noteCompleted = document.createElement("button");
    noteCompleted.classList.add("note-btn");
    noteCompleted.classList.add("completed-btn");
    noteCompleted.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    notesDiv.appendChild(noteCompleted);

    const deleteNote = document.createElement("button");
    deleteNote.classList.add("note-btn");
    deleteNote.classList.add("del-btn");
    deleteNote.innerHTML = '<i class="fa-solid fa-circle-minus"></i>';

    notesDiv.appendChild(deleteNote);
}

function clearLS(e)
{
    let notes;

    if(localStorage.getItem("notes") === null)
    {
        notes = [];
    }
    else
    {
        notes = JSON.parse(localStorage.getItem("notes"));
    }

    const indexOfNote = notes.indexOf(e);
    notes.splice(indexOfNote, 1);

    localStorage.setItem("notes", JSON.stringify(notes));
}