const { ref } = require("joi");
const mongoose = require("mongoose");
const user = require("./user");
const schema = mongoose.Schema;


const listSchema = new schema({ // Schema
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        default: 
            "https://unsplash.com/photos/orange-and-gray-concrete-house-surround-by-snow-Sv4btqhcYqw",
        set: 
            (v) => v == ""? 
                "https://unsplash.com/photos/orange-and-gray-concrete-house-surround-by-snow-Sv4btqhcYqw": v,
    },
    price: Number,
    location: String,
    country: String,
    review: [
        {
            type: schema.Types.ObjectId,
            ref: "reviews",
        }
    ],
    owner: {
        type: schema.Types.ObjectId,
        ref: "user",
    }
});

const Listing = mongoose.model("Listing",listSchema); // Colletion

module.exports = Listing;