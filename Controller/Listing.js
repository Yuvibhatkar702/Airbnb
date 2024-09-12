const Listing = require("../index.js");

module.exports.index = async (req, res) => {
    let allList = await Listing.find({});
    res.render("Listing/List.ejs", { allList });
}