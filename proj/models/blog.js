let mongoose = require("mongoose");
let schema = mongoose.Schema;
let blogschema = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
},{timestamps:true})

let Blog = mongoose.model('blogs',blogschema);

module.exports = Blog;