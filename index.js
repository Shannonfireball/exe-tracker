const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const { parse } = require('dotenv');


const User = require('./model/user');
app.use(bodyParser.urlencoded({ extended:false }));

mongoose.connect(process.env.my_se,{ useUnifiedTopology:true, useNewUrlParser:true })




app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});







app.all('*',(request,response) => {

  response.status(404);
  if(request.accepts('html')){
      response.json( {error:"404 not found"});
  } else if(request.accepts('json')){
      response.json( {error:"404 not found"});
  } else {
      response.type('txt').send('404 not found');
  }

});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
