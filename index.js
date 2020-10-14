const express = require('express')
var morgan = require('morgan')
const app = express()

//MIDDLEWARE
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(express.json())
morgan.token('post_data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :post_data'))
//MIDDLEWARE

let people = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Welcome to phonebook api!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(people)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = people.find((p) => p.id === id)
    if (person)
        res.json(person)
    else
        res.status(404).send('Sorry, that user is not in the database.')
})

app.get('/info', (req, res) => {
    res.send(`
    <div>
        <p>Phonebook has info for ${people.length} people </p>
        <p>${new Date()}</p> 
    </div>
    
    `)
})


app.post('/api/persons', (req, res) => {
    const name = req.body.name
    const number = req.body.number

    if (!name || !number)
        return res.status(400).json({ error: `Name and number are mandatory fields. Name recieved was: ${name} and number recieved was: ${number}` })

    if (people.find((p) => p.name === name))
        return res.status(409).json({ error: `The name "${name}" is already present in the database.` })

    const id = Math.floor(Math.random() * 10000)

    const entry = {
        id: id,
        name: name,
        number: number
    }

    people = people.concat(entry)

    res.json(entry)
})

//MIDDLEWARE
app.use(unknownEndpoint)
//MIDDLEWARE

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})