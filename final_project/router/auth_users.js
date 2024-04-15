const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    const findUser = users.find((user) => user.username === username)
    if (findUser) return true;
    else return false;
}

const authenticatedUser = (username, password) => {
    const validUser = users.some((user) => user.username === username);

    if (validUser) {
        const validPassword = users.some((user) => user.username === username && user.password === password);
        return validPassword;
    } else {
        return false;
    }
};


//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(403).json({ message: "Username and password must be valid" });
    }

    const isvalid = authenticatedUser(username, password)

    if (isvalid) {
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken
        }
        return res.status(200).send({ message: "User successfully logged in", users });
    } else {
        return res.status(401).send({ message: "Unauthorized" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.resenha;
    if(req.session.authorization === undefined){
        return res.status(403).json({message: "Unauthorized"})
    }
    let token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
            const reviewer = req.user.data
            if (books[isbn]) {
                if (books[isbn].reviews[reviewer]) {
                    books[isbn].reviews[reviewer] = review;
                } else {
                    books[isbn].reviews[reviewer] = review;
                }
                res.status(200).send({message: "Review added succesfully", books});
            } else {
                res.status(404).send({message: "Book not found"});
            }
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });    
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    
    const isbn = req.params.isbn;

    if(req.session.authorization === undefined){
        return res.status(403).json({message: "Unauthorized"})
    }
    let token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
            const reviewer = req.user.data
            if (books[isbn]) {
                if (books[isbn].reviews[reviewer]) {
                  delete books[isbn].reviews[reviewer];
                } else {
                    return res.status(404).send({message: "Review not found"});
                }
                return res.status(200).send({message: "Review removed succesfully", books});
            } else {
                return res.status(404).send({message: "Book not found"});
            }
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
