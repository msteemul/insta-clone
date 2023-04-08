require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require('./keys');

const PORT = 8888;



try {
    // Connect to MongoDB
    mongoose.connect(MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Handle connection errors
    mongoose.connection.on('error', (err) => {
        console.error('Error connecting to MongoDB:', err);
    });
} catch (err) {
    console.error('Error connecting to MongoDB:', err);
}



require('./models/user');
require('./models/post');
app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});