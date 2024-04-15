const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      res.status(403).send({ message: "Username or password must be valid" });

    const isvalid = isValid(username);

    if (isvalid)
      return res.status(403).json({ message: "user already registered" });
    else {
      users.push({ username, password });
      return res.status(200).json({ message: "The user has been registered" });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // return res.status(200).json(books);

  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error("Error while fecthing your data"));
    }
  })
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // try {
  //     const booksFiltered = books[req.params.isbn]
  //     return res.status(200).json(booksFiltered);
  // } catch (error) {
  //     return res.status(404).send(error);

  // }

  return new Promise((resolve, reject) => {
    if (req.params.isbn) {
      if (books[req.params.isbn]) {
        const booksFiltered = books[req.params.isbn];
        resolve(booksFiltered);
      } else {
        reject(new Error("Book not found"));
      }
    } else {
      reject(new Error("Error while getting your data. Verify your request"));
    }
  })
    .then((booksFiltered) => {
        res.status(200).json(booksFiltered)}
    )
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // try {
  //     const requestedAuthor = req.params.author;

  //     const matchingBooks = Object.values(books).filter(book => book.author === requestedAuthor);

  //     return res.status(200).json(matchingBooks);
  // } catch (error) {
  //     return res.status(404).send(error);

  // }

  return new Promise((resolve, reject) => {
    if (req.params.author) {
      const requestedAuthor = req.params.author;
      const matchingBooks = Object.values(books).filter(
        (book) => book.author === requestedAuthor
      );
      resolve(matchingBooks);
    } else {
      reject(new Error("Book not found"));
    }
  })
    .then((matchingBooks) => {
      res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  // try {
  //     const requestedTitle = req.params.title;

  //     const matchingBooks = Object.values(books).filter(book => book.title === requestedTitle);

  //     return res.status(200).json(matchingBooks);
  // } catch (error) {
  //     return res.status(400).send(error);

  // }

  return new Promise((resolve, reject) => {
    if (req.params.title) {
      const requestedTitle = req.params.title;
      const matchingBooks = Object.values(books).filter(
        (book) => book.title === requestedTitle
      );

      resolve(matchingBooks);
    } else {
      reject(new Error("Book not found"));
    }
  })
    .then((matchingBooks) => {
      res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // try {
  //     const bookId = req.params.isbn;

  //     const bookFiltered = books[bookId].reviews;

  //     return res.status(200).json(bookFiltered);

  // } catch (error) {

  //     return res.status(400).send(error);

  // }

  return new Promise((resolve, reject) => {
    if (req.params.isbn) {
      const bookId = req.params.isbn;
      const bookFiltered = books[bookId].reviews;
      resolve(bookFiltered);
    } else {
      reject(new Error("Book not found"));
    }
  })
    .then((bookFiltered) => {res.status(200).json(bookFiltered)})
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
});

module.exports.general = public_users;
