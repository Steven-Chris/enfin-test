import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3030/book";

const AddBook = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getAll?search=&page=1&limit=10`
      );
      setBooks(response.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, price, description, published_date } = form;
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!price) newErrors.price = "Price is required";
    if (!description) newErrors.description = "Description is required";
    if (!published_date)
      newErrors.published_date = "Published date is required";
    return newErrors;
  };

  const formSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/add`, form);
      console.log("Form submitted successfully:", response.data);
      setForm({});
      setErrors({});
      fetchBooks();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const deleteBook = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete`, {
        params: { id },
      });
      console.log("Book deleted successfully:", response.data);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const editBook = (book) => {
    setForm(book);
  };

  const renderBooks = () => {
    return (
      <div>
        {books.map((book) => (
          <div
            key={book.id}
            className="flex flex-col gap-5 items-start justify-between p-5 border border-gray-200"
          >
            <div>
              <strong>Name:</strong> {book.name}
            </div>
            <div>
              <strong>Price:</strong> {book.price}
            </div>
            <div>
              <strong>Published Date:</strong> {book.published_date}
            </div>
            <div>
              <strong>Description:</strong> {book.description}
            </div>
            <div className="flex gap-3">
              <button onClick={() => editBook(book)}>Edit</button>
              <button onClick={() => deleteBook(book._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 items-start justify-between p-10 border border-white">
      <div className="flex justify-between gap-10">
        <label>Name</label>
        <input
          name="name"
          onChange={handleChange}
          value={form.name || ""}
          type="text"
        />
        {errors.name && <span className="text-red-500">{errors.name}</span>}
      </div>
      <div className="flex gap-10">
        <label>Price</label>
        <input
          name="price"
          onChange={handleChange}
          value={form.price || ""}
          type="text"
        />
        {errors.price && <span className="text-red-500">{errors.price}</span>}
      </div>
      <div className="flex gap-10">
        <label>Published Date</label>
        <input
          name="published_date"
          onChange={handleChange}
          value={form.published_date || ""}
          type="text"
        />
        {errors.published_date && (
          <span className="text-red-500">{errors.published_date}</span>
        )}
      </div>
      <div className="flex gap-10">
        <label>Description</label>
        <textarea
          name="description"
          onChange={handleChange}
          value={form.description || ""}
          cols="30"
          rows="5"
        ></textarea>
        {errors.description && (
          <span className="text-red-500">{errors.description}</span>
        )}
      </div>
      <button onClick={formSubmit}>Add Book</button>

      <div className="mt-5">
        <h2>Books List</h2>
        {renderBooks()}
      </div>
    </div>
  );
};

export default AddBook;
