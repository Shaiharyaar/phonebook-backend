const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

// adding middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const generateUniqueId = () => Math.floor(Math.random() * 100000000000000000000)

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(
    `<div><p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p></div>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  response.json(person)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing',
    })
  } else if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: 'Name must be unique',
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateUniqueId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing',
    })
  } else {
    const index = persons.findIndex((person) => person.id === id)

    if (index !== -1) {
      const updatedPerson = {
        id,
        name: body.name,
        number: body.number,
      }

      persons[index] = { ...persons[index], ...updatedPerson }

      response.json(updatedPerson)
    } else {
      response.status(400).send({ error: 'malformatted id' })
    }
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)
  if (person) {
    persons = persons.filter((note) => note.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
