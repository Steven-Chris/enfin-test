import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3030/book";

const AddBook = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [books, setBooks] = useState([]);
  const [isEditId, setIsEditId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = async (search = "") => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getAll?search=${encodeURIComponent(
          search
        )}&page=1&limit=10`
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

  const handleSearch = () => {
    fetchBooks(searchQuery);
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
      if (isEditId) {
        await editBook();
        setIsEditId("");
      } else {
        await addBook();
      }
      setForm({});
      setErrors({});
      fetchBooks();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const addBook = async () => {
    const response = await axios.post(`${BASE_URL}/add`, form);
    console.log("Form submitted successfully:", response.data);
    return response.data;
  };

  const editBook = async () => {
    const response = await axios.put(`${BASE_URL}/edit?id=${isEditId}`, form);
    console.log("Book edited successfully:", response.data);
    return response.data;
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

  const setEditForm = (book) => {
    setForm(book);
    setIsEditId(book._id);
  };

  const renderBooks = () => {
    return (
      <div>
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white shadow-md rounded-md p-4 mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{book.name}</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditForm(book)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBook(book._id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">Price: ${book.price}</p>
            <p className="text-gray-600 mb-2">
              Published Date: {book.published_date}
            </p>
            <p className="text-gray-600 mb-2">
              Description: {book.description}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-5 items-start justify-between p-10 border border-gray-200 rounded-md shadow-md bg-gray-50">
        <div className="flex flex-wrap gap-5 w-full">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="block mb-1">Name</label>
            <input
              name="name"
              onChange={handleChange}
              value={form.name || ""}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {errors.name && (
              <span className="text-red-500 mt-1">{errors.name}</span>
            )}
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <label className="block mb-1">Price</label>
            <input
              name="price"
              onChange={handleChange}
              value={form.price || ""}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {errors.price && (
              <span className="text-red-500 mt-1">{errors.price}</span>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="block mb-1">Published Date</label>
            <input
              name="published_date"
              onChange={handleChange}
              value={form.published_date || ""}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {errors.published_date && (
              <span className="text-red-500 mt-1">{errors.published_date}</span>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              value={form.description || ""}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows="5"
            />
            {errors.description && (
              <span className="text-red-500 mt-1">{errors.description}</span>
            )}
          </div>
        </div>
        <button
          onClick={formSubmit}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
        >
          {!!isEditId ? "Edit Book" : "Add Book"}
        </button>
        <div className="flex flex-col w-full md:w-auto">
          <label className="block mb-1">Search</label>
          <div className="flex">
            <input
              type="text"
              className="w-full md:w-56 border border-gray-300 rounded-md px-3 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Search
            </button>
          </div>
        </div>
        <div className="mt-5 w-full">{renderBooks()}</div>
      </div>
    </div>
  );
};

export default AddBook;
