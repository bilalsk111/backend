const mongoose = require('mongoose');


function ConnectToDatabase() {
    // Database connection logic would go here
    mongoose.connect('mongodb+srv://bilalshaikj6_db_user:QX7pbrtmmN2YxIBi@cohort.xc6mjbc.mongodb.net/day6')
    .then(() => {
        console.log('Connected to the database successfully');
    })
    .catch((err) => {
        console.log('Error connecting to database:', err);
    });
}

module.exports = ConnectToDatabase;