const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
    comments:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createAt:{
        type:Date,
        default:Date.now()
    }
});

const review = mongoose.model("review",reviewsSchema);

module.exports = review;