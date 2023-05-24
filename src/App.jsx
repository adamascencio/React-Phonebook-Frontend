import { useState, useEffect } from "react";
import peopleService from "./api/personsApi";
import "./styles.css";

const Filter = ({ searchFilter, handleSearch }) => {
  return (
    <div>
      filter shown with <input value={searchFilter} onChange={handleSearch} />
    </div>
  );
};

const PersonForm = ({ addName, handleChange, newName, newNumber }) => {
  return (
    <form onSubmit={addName}>
      <h2>add a new</h2>
      <div>
        name: <input name="name" value={newName} onChange={handleChange} />
      </div>
      <div>
        number:{" "}
        <input name="number" value={newNumber} onChange={handleChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ searchFilter, persons, handleDelete }) => {
  const renderPersons = searchFilter
    ? persons?.map((person) => {
        if (person.name.toLowerCase() === searchFilter.toLowerCase()) {
          return (
            <li key={person.id}>
              {person.name} {person.number}
              <button onClick={() => handleDelete(person.id)}>delete</button>
            </li>
          );
        }
      })
    : persons?.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </li>
      ));

  return <ul>{renderPersons}</ul>;
};

const Notification = ({ message, status }) => {
  return <div className={status ? "success" : "error"}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    peopleService.getPersons().then((res) => setPersons(res));
  }, []);

  const handleSearch = (e) => {
    setSearchFilter(e.target.value);
  };

  const handleChange = (e) => {
    e.target.name === "name"
      ? setNewName(e.target.value)
      : setNewNumber(e.target.value);
  };

  const handleDelete = (id) => {
    if (window.confirm("Do you wish to delete this person")) {
      setPersons(persons.filter((person) => person.id !== id));
      peopleService.deletePerson(id);
    }
  };

  const addName = (e) => {
    e.preventDefault();

    const personObj = {
      name: newName,
      number: newNumber,
    };

    for (const [idx, entry] of persons.entries()) {
      if (entry.name === newName) {
        if (
          window.confirm(
            `${newName} is already added to phonebook. Would you like to update their number?`
          )
        ) {
          peopleService
            .updatePerson(entry.id, personObj)
            .then((returnedPerson) => {
              if (returnedPerson === 0) {
                const removedPerson = persons.filter(
                  (obj) => obj.id !== entry.id
                );
                console.log("removedPerson:", removedPerson);
                setStatus(false);
                setStatusMessage(
                  `Information of ${entry.name} has already been removed from the server`
                );
                setPersons(removedPerson);

                setTimeout(() => {
                  setStatus(null);
                  setStatusMessage(null);
                }, 5000);
                return;
              }

              const copiedArr = persons.slice();
              copiedArr[idx] = returnedPerson;
              setPersons(copiedArr);
              setStatus(true);
              setStatusMessage(
                `${returnedPerson.name} was successfully updated`
              );

              setTimeout(() => {
                setStatus(null);
                setStatusMessage(null);
              }, 5000);
            });
        }

        setNewName("");
        setNewNumber("");
        return;
      }
    }

    peopleService.createPerson(personObj).then((returnedPerson) => {
      console.log(returnedPerson);
      setPersons([...persons, returnedPerson]);
      setNewName("");
      setNewNumber("");
      setStatus(true);
      setStatusMessage(`${returnedPerson.name} has been added`);

      setTimeout(() => {
        setStatus(null);
        setStatusMessage(null);
      }, 5000);
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {statusMessage && (
        <Notification status={status} message={statusMessage} />
      )}
      <Filter handleSearch={handleSearch} searchFilter={searchFilter} />
      <PersonForm
        addName={addName}
        handleChange={handleChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons
        searchFilter={searchFilter}
        persons={persons}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
