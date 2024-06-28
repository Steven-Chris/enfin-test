const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.post("/add", bookController.addBook);
router.get("/getAll", bookController.getAllBooks);
router.put("/edit", bookController.editBook);
router.delete("/delete", bookController.deleteBook);
module.exports = router;
