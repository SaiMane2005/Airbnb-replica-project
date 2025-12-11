const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://unsplash.com/photos/modern-living-room-with-abstract-art-and-plush-furniture-Wkqs3XD8JPk",
    },
  },

  price: Number,
  location: String,
  country: String,

  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
