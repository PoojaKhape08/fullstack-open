import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name === newName
    )

    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmReplace) {
        const changedPerson = {
          ...existingPerson,
          number: newNumber
        }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(person =>
                person.id === existingPerson.id
                  ? returnedPerson
                  : person
              )
            )

            setMessage({
              text: `Updated ${returnedPerson.name}`,
              type: 'success'
            })

            setTimeout(() => {
              setMessage(null)
            }, 5000)

            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            setMessage({
              text: `Information of ${existingPerson.name} has already been removed from server`,
              type: 'error'
            })

            setTimeout(() => {
              setMessage(null)
            }, 5000)

            setPersons(
              persons.filter(
                person => person.id !== existingPerson.id
              )
            )
          })
      }

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        setMessage({
          text: `Added ${returnedPerson.name}`,
          type: 'success'
        })

        setTimeout(() => {
          setMessage(null)
        }, 5000)

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setMessage({
          text: error.response.data.error,
          type: 'error'
        })

        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(
            persons.filter(person => person.id !== id)
          )
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />

      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h2>Add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
        persons={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App