// Require mongoose
var mongoose = require('mongoose');

// Create Schema class
var Schema = mongoose.Schema;

// Create story schema
var StorySchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // summary is a required string
  summary: {
    type: String,
    required: true
  },
  // image is a required string
  image: {
    type: String,
    required: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Story model with the StorySchema
var Story = mongoose.model("Story", StorySchema);

// Export the model
module.exports = Story;