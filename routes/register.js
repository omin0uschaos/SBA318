const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const fs = require('fs');

const users = require("../data/users");
const ships = require("../data/ships");
const makes = require("../data/makes");
const { generateUserID: userIdGen } = require("../scripts/idGen");

router.get("/", (req, res) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        

        const options = {

            title: `Register a new user`,
            subTitle: `Create an account`,
            content: `<div id="user-registration-form">
                        <h2>User Registration</h2>
                        <form action="/register" method="POST">                            
                            <div class="form-group">
                                <label for="name">Name:</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="username">Username:</label>
                                <input type="text" id="username" name="username" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="password" id="password" name="password" required>
                            </div>
                            <div class="form-group">
                                <label for="confirm-password">Confirm Password:</label>
                                <input type="password" id="confirm-password" name="confirmPassword" required>
                            </div>

                            <button type="submit">Register</button>
                        </form>
                    </div>
            `
        };
        res.render("register", options);
    });
}).post("/", (req, res, next) => {
    const { username, name, password, confirmPassword } = req.body;

    // Check if username already exists
    if (Object.values(users).some(user => user.username === username)) {
        const options = {
            title: "Intergalactic Ship Registry",
            subTitle: `Username Taken!`,
            content: `Sorry, Username already exists! Go back and try a different username!`
        };
        return res.status(400).render("error", options);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        const options = {
            title: "Intergalactic Ship Registry",
            subTitle: `Password  Error!`,
            content: `Sorry, Passwords do not match!`
        };
        return res.status(400).render("error", options)
    }

    // Generate unique license ID
    const licenseId = userIdGen();

    // Create user object
    const newUser = {
        name,
        username,
        password: bcrypt.hashSync(password, 10),
        licenseId,
        shipsOwned: [],
    };

    // Add user to users object
    users[licenseId] = newUser;

    // Write updated users object to users.json file
    fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const options = {

            title: `Account created`,
            subTitle: `Account created`,
            content: `<div id="user-registration-form">
                        <h2>User registered successfully</h2>
                        <h4>(Check <a href="/users">Users page</a> to see your account on the list. Login functionality still a Work In Progress)</h4>
            `
        };
        res.render("register", options);
    });
});

module.exports = router;