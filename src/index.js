const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const routes = require('./routes.js');

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-pvxkk.gcp.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use(routes);

app.listen(3333);