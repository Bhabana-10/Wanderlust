
require("dotenv").config();

const mongoose = require("mongoose");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("./models/listing");

const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAP_TOKEN,
});

async function updateCoordinates() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

  const listings = await Listing.find({});
  console.log(`Found ${listings.length} listings to update.`);

  for (const listing of listings) {
    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: listing.location,
          limit: 1,
        })
        .send();

      if (!response.body.features.length) {
        console.log(`No coordinates found for: ${listing.location}`);
        continue;
      }

      listing.geometry = response.body.features[0].geometry;
      await listing.save();

      console.log(`Updated: ${listing.location}`);
    } catch (err) {
      console.log(`Failed: ${listing.location}`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log("Finished updating coordinates.");
}

updateCoordinates().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
});
