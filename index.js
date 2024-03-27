const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Define schema
const studentSchema = new mongoose.Schema({
  name: String,
  studentID: String
});

// Define model with collection name "w24students"
const Student = mongoose.model('Student', studentSchema, 'w24students');

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

app.post('/', (req, res) => {
  const mongoURI = req.body.myuri;
  if (!mongoURI) {
    return res.status(400).send('MongoDB URI is required.');
  }

  // Connect to MongoDB
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
      // Add data to the database
      const newStudent = new Student({
        name: 'Mart Leonar Berido',
        studentID: '300361929'
      });
      newStudent.save()
        .then(() => {
          console.log('Document Added');
          mongoose.disconnect(); 
          res.send(`<h1>Document Added</h1>`);
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Error adding document to database.');
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error connecting to MongoDB.');
    });
});

app.listen(port, () => {
  // http://localhost:3000
  console.log(`Server is running on port: ${port}`);
});
