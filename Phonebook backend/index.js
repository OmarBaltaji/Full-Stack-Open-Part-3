require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json());

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('build'));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    })
});

app.get('/info', (req, res) => {
    Person.countDocuments({}).then(count => {
        const entries = `Phonebook has info for ${count} people`;
        const date = new Date();
        res.send(`<div>${entries}</div><br><div>${date}</div>`);
    })
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person);
    }).catch(error => {
        res.status(404).end();
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if(!body.name) {
        return res.status(400).json({error: 'name is missing'});
    }

    if(!body.number) {
        return res.status(400).json({error: 'number is missing'});
    }

    const foundPerson = persons.find(person => person.name === body.name);
    if(foundPerson) {
        return res.status(409).json({error: 'name must be unique'});
    }

    const person = {
        id:  Math.floor(Math.random() * 999999999),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);

    res.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running from port ${PORT}`);
});