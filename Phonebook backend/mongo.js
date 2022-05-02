const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please at least provide the password as an argument: node mongo.js <password>');
    process.exit(1);
} else {
    const password = process.argv[2];
    const url = `mongodb+srv://Omar:${password}@testcluster1.tgoev.mongodb.net/phonebook?retryWrites=true&w=majority`;
    mongoose.connect(url);

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    });

    const Person = mongoose.model('Person', personSchema);

    switch(process.argv.length) {
        case 3:
            Person.find({}).then(res => {
                console.log('phonebook:');
                res.forEach(person => {
                    console.log(person.name + ' ' + person.number);
                });
                mongoose.connection.close();
            });
            break;
        case 4:
            console.log('Please provide the name and number of the person');
            break;
        case 5:
            const name = process.argv[3];
            const number = process.argv[4];
            const person = new Person({ name, number });
            person.save().then(res => {
                console.log(`added ${res.name} number ${res.number} to phonebook`);
                mongoose.connection.close();
            });
            break;
    }
}
