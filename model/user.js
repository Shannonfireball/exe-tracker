const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  });
  
module.exports = mongoose.model("User",userSchema);