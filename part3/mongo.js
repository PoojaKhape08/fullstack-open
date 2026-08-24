require('dotenv').config()

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB')

    const personSchema = new mongoose.Schema({
      name: String,
      number: String
    })

    const Person = mongoose.model('Person', personSchema)

    if (process.argv.length === 3) {
      Person.find({}).then(persons => {
        console.log('phonebook:')

        persons.forEach(person => {
          console.log(person.name, person.number)
        })

        mongoose.connection.close()
      })
    } else {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })

      person.save().then(() => {
        console.log(
          `added ${person.name} number ${person.number} to phonebook`
        )

        mongoose.connection.close()
      })
    }
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message)
  })