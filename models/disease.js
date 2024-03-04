const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter disease name"],
    trim: true,
    maxLength: [50, "Disease name cannot exceed 50 characters"],
  },

  description: {
    type: String,
    required: [true, "Please enter disease description"],
  },

  part: {
    type: String,
    required: [true, "Please enter the part of Taro affected"],
    trim: true,
    maxLength: [30, "It cannot exceed 30 characters"],
  },

  images: [
    {
      public_id: {
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: false,
      },
    },
  ],

  // ratings: {
  //     type: Number,
  //     default: 0,
  // },

  // numOfReviews: {
  //     type: Number,
  //     default: 0,
  // },

  // reviews: [
  //     {
  //         name: {
  //             type: String,
  //             required: true,
  //         },

  //         rating: {
  //             type: Number,
  //             required: true,
  //         },

  //         comment: {
  //             type: String,
  //             required: true,
  //         },
  //     },
  // ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Disease", diseaseSchema);
