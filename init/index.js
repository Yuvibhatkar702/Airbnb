const mongoose = require("mongoose");
const intData = require("./data.js");
const lisning = require("../moduls/Resister.js");
const data = require("./data.js");

main().then(() => {
    console.log("Connected To the dataBase....");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/rent");
}

const intDT = async () => {
    await lisning.deleteMany({});
    intData.data = intData.data.map((obj) => ({...obj, owner: "66c9ae8c8574c881d4cc53bd"}));
    await lisning.insertMany(intData.data);
    console.log("Data inizitaz...");
};

intDT();