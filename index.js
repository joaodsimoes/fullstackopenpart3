require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

//MIDDLEWARE
app.use(cors())
app.use(express.static('build'))
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
morgan.token('post_data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :post_data'))
//MIDDLEWARE


app.get('/', (req, res) => {
    res.send('<h1>Welcome to phonebook api!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => res.json(people))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedNote => {
            if (updatedNote) {
                response.json(updatedNote)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        }).catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({}).then(people =>
        res.send(`
    <div>
        <p>Phonebook has info for ${people.length} people </p>
        <p>${new Date()}</p> 
    </div>
    
    `))

})


app.post('/api/persons', (req, res) => {
    const name = req.body.name
    const number = req.body.number

    if (!name || !number)
        return res.status(400).json({ error: `Name and number are mandatory fields. Name recieved was: ${name} and number recieved was: ${number}` })

    const entry = new Person({
        name: name,
        number: number,
    })

    entry.save()
        .then(savedEntry =>
            res.json(savedEntry))
})

//MIDDLEWARE
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)
//MIDDLEWARE

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})