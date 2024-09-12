const mongoose = require("mongoose");
const schema = mongoose.Schema;

const localPassportMongoose = require("passport-local-mongoose");

const userSchema = new schema({
    email: {
        type:String,
        require:true
    }
})


userSchema.plugin(localPassportMongoose);

module.exports = mongoose.model("User", userSchema);