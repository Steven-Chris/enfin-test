const mongoose = require("mongoose");
require("dotenv").config();

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    published_date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.methods.toJSON = function () {
  const book = this;
  const bookObject = book.toObject();

  return bookObject;
};

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
