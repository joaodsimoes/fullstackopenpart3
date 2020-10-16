const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const url =
    `mongodb+srv://joaodaniel:${password}@cluster0.4e9dc.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const People = mongoose.model('People', personSchema)

if (process.argv.length === 3) {

    People.find({}).then(result => {
        console.log()
        console.log("Phonebook:")
        result.forEach(person => console.log(person.name+" "+person.number))
        console.log()
        mongoose.connection.close()
    })

}

if (process.argv.length == 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new People({
        name: name,
        number: number,
    })

    person.save().then(result =>{
    console.log(`Added ${result.name}, number ${result.number} to phonebook.`)
    mongoose.connection.close()
    })


}
