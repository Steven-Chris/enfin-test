const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { addBookValidate } = require("../middleware/inputValidation");

router.post("/add", addBookValidate, bookController.addBook);
router.get("/getAll", bookController.getAllBooks);
router.put("/edit", bookController.editBook);
router.delete("/delete", bookController.deleteBook);
module.exports = router;
