const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const Schema = mongoose.Schema;
const mySecret = 'mongodb+srv://mongotut123:testing1234@cluster0.sisrp.mongodb.net/test?retryWrites=true&w=majority'

app.use(bodyParser.urlencoded({ extended:false }));
mongoose.connect(mySecret,{ useUnifiedTopology:true, useNewUrlParser:true })

const userSchema = new Schema({
  username:{
    type:String,
    require:true
  },
  log: [{
    date:String,
    duration:Number,
    description:String
    
  }],
  count:Number
});

let User = mongoose.model("User", userSchema);


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.route('/api/users')
   .post( (request, response) => {
  const username  = request.body.username;
  const user =  new User({ username , count:0 })
  user.save((error,data) => {
    if(error){
      response.json({ error:error})
    }
    response.json(data);
  })
})
.get((request,response) => {
  User.find((error,data) => {
   if(data){
     response.json(data);
   }   
  })
  
})


app.post('/api/users/:_id/exercises',(request, response) => {
  const description = request.body.description;
  const duration = parseInt(request.body.duration);
  const date = request.body.date? 'Mon Jan 01 1990':(new Date).toDateString();
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

app.get('/api/users/:_id/logs?',(request,response)=>{
  const { from, to, limit} = request.query
  console.log(from, to, limit );

  
  User.findById(request.params._id, (error, user) => {
      if(user) {
      if(from||to||limit) {
          const logs = user.log;
          console.log(logs);
    
          const filteredLogs = logs.filter((log) => {
            const formattedLogDate = (new Date(log.date)).toDateString()
            console.log(formattedLogDate);
            return true
          })
          
          console.log(filteredLogs);
          const slicedLogs = limit ? filteredLogs.slice(0, limit) : filteredLogs;
          user.log = slicedLogs;
          console.log(slicedLogs);
      }
      response.json(user);
    }
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
// 8:23:05