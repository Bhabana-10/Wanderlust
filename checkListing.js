
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

async function checkListings() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

  const listings = await Listing.find({}, "title location geometry");

  listings.forEach((listing) => {
    console.log({
      title: listing.title,
      location: listing.location,
      geometry: listing.geometry,
    });
  });

  await mongoose.disconnect();
}

checkListings().catch(console.error);
