const mongoose = require("mongoose");

const taroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"],
    trim: true,
    maxLength: [50, "Title cannot exceed 50 characters"],
  },

  description: {
    type: String,
    required: [true, "Please enter a description"],
  },

  subtitle: {
    type: String,
    required: [true, "Please enter a subtitle"],
    trim: true,
    maxLength: [50, "Subtitle name cannot exceed 50 characters"],
  },

  ratings: {
    type: Number,
    default: 0,
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

  category: {
    type: String,
    required: [true, "Please select the category"],
    enum: {
      values: ["About", "Benefit"],
      message: "Please select correct type",
    },
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      name: {
        type: String,
        required: true,
      },

      rating: {
        type: Number,
        required: true,
      },

      comment: {
        type: String,
        required: true,
      },
    },
  ],

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

module.exports = mongoose.model("Taro", taroSchema);
