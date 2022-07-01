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


app.route('/api/users')
   .post(async (request, response) => {
  const username  = request.body.username;
  const result = await User.create({username}).exec();
  response.json({result});
})
.get(async (request,response) => {
  const result = await User.find();
  response.json(result);
  
})


app.post('/api/users/:_id/exercises',(request, response) => {
  const description = request.body.description;
  const duration = parseInt(request.body.duration);
  const date = request.body.date? 'Mon Jan 01 1990':"Fri Jul 01 2022";
  const id = request.params._id;


  const exercise = {
        date,
        duration,
        description,
        
        
  }

  
  User.findByIdAndUpdate(id,{ $push: { log:exercise }, $inc:{count:1 } }, {new:true}, (error,user) => {
  if(user){
    const updatedExercise = {
                            _id:id,
                             username:user.username,
                             ...exercise };
    // console.log(updatedExercise);
    response.json(updatedExercise)
  }
  })

  
});

app.get('/api/users/:_id/logs',async (request,response)=>{
  const { from, to, limit} = request.query
  const id = request.params._id;
  console.log(from, to, limit );

  
  const result = await User.find({ _id:id }).limit(limit).exec();
  response.json(result);
})






// app.get('/api/users/:_id/logs?',(request,response)=>{


  
//   User.findById(request.params._id, (error, user) => {
      
//       let responseObject = user;
    
//       if(request.query.from || request.query.to || request.query.limit){
//       if(request.query.from || request.query.to){
//         const fromDate = new Date(0);
//         const toDate = new Date();
//         if(request.query.from){
//           fromDate = new Date(request.query.from);
//         }
//         if(request.query.to){
//           toDate = new Date(request.query.to);
//         }
//         fromDate = fromDate.getTime();
//         toDate = toDate.getTime();

//         responseObject.log = responseObject.log.filter((log) =>{
//           let logDate = new Date(log.date).getTime();

//           return logDate >= fromDate && logDate <= toDate;
//         })
        
//       }
//       if(request.query.limit) {  
//         responseObject.log = responseObject.log.slice(0,request.query.limit);
//       }
//   }    


//       responseObject['count'] = responseObject.log.length
//       response.json(
//         {
//           "username": responseObject.username,
//           "count": responseObject.count,
//           "_id": responseObject._id,
//           "log": responseObject.log
// });
      

    
//   })
// })


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
// 8:23:05