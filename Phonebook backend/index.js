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

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        res.json(person);
    }).catch(error => {
        next(error);
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id).then(result => {
        res.status(204).end();
    }).catch(error => next(error));
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if(!body.name) {
        return res.status(400).json({error: 'name is missing'});
    }

    if(!body.number) {
        return res.status(400).json({error: 'number is missing'});
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        res.json(savedPerson);
    });
});

app.put('/api/persons/:id', (req, res) => {
    const body = req.body;
    
    if(!body.number) {
        return res.status(400).json({error: 'number is missing'});
    }

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true}).then(updatedPerson => {
        res.json(updatedPerson);
    }).catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'});
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if(error.name === 'CastError') {
        return response.status(404).send({error: 'malformatted id'});
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running from port ${PORT}`);
});