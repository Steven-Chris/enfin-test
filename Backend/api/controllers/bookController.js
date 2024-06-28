const Book = require("../../models/bookModel");
const { handleError } = require("../lib/errorHandling");
const constantConfig = require("../../config/constantConfig");

// const auth = require("../middleware/auth");

module.exports.addBook = async (req, res) => {
  const book = new Book(req.body);
  console.log(book);
  try {
    await book.save();
    const { _id } = book;
    res.status(201).json({ _id });
  } catch (err) {
    handleError("error", err, "");
    return res.status(constantConfig.INTERNAL_SERVER_ERROR).json({
      status: constantConfig.ERROR,
      message: constantConfig.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.getAllBooks = async (req, res) => {
  try {
    const { search, limit, page } = req.query;
    const skip = (page - 1) * limit;
    let params = {};
    if (search && search != "") {
      const regex = new RegExp(`.*${search}.*`, "i");
      params = {
        $or: [{ name: regex }, { description: regex }],
      };
    }
    const books = await Book.find(params).skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments(params);
    res.status(200).json({ books, totalBooks });
  } catch (err) {
    handleError("error", err, "");
    return res.status(constantConfig.INTERNAL_SERVER_ERROR).json({
      status: constantConfig.ERROR,
      message: constantConfig.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.editBook = async (req, res) => {
  try {
    const bookId = req.query.id;
    if (!bookId)
      return res.status(constantConfig.INVALID_REQUEST).json({
        status: constantConfig.ERROR,
        message: constantConfig.INVALID_REQUEST_MESSAGE,
      });
    const { name, description, price, published_date } = req.body;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (name) book.name = name;
    if (description) book.description = description;
    if (price) book.price = price;
    if (published_date) book.published_date = published_date;

    await book.save();
    res.status(200).json(book);
  } catch (err) {
    handleError("error", err, "");
    return res.status(constantConfig.INTERNAL_SERVER_ERROR).json({
      status: constantConfig.ERROR,
      message: constantConfig.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.query.id;
    if (!bookId)
      return res.status(constantConfig.INVALID_REQUEST).json({
        status: constantConfig.ERROR,
        message: constantConfig.INVALID_REQUEST_MESSAGE,
      });

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    await book.remove();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    handleError("error", err, "");
    return res.status(constantConfig.INTERNAL_SERVER_ERROR).json({
      status: constantConfig.ERROR,
      message: constantConfig.SOMETHING_WENT_WRONG,
    });
  }
};
