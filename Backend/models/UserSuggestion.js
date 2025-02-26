const mongoose = require("mongoose");
const userSuggestions = new mongoose.Schema(
  {
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    text:{
        type:String,
        required:true
    }
  },
 
);

// Hash password before saving

// Compare password method

module.exports = mongoose.model("UserSuggestions", userSuggestions);