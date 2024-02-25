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
                                <label for="email">Email:</label>
                                <input type="email" id="email" name="email" required>
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
    const { username, email, password, confirmPassword } = req.body;

    // Check if username already exists
    if (users.hasOwnProperty(username)) {
        return res.status(400).send('Username already exists');
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    // Generate unique license ID
    const licenseId = userIdGen();

    // Get current year
    const currentYear = new Date().getFullYear();

    // Set expiration date 10 years later
    const expirationYear = currentYear + 10;

    // Create user object
    const newUser = {
        username,
        password: bcrypt.hashSync(password, 10), // Hash password before saving
        licenseData: {
            licenseId,
            licenseType: "C",
            issuedYear: currentYear,
            expiration: expirationYear,
            status: "valid"
        },
        personData: {
            name: "",
            Address: "",
            Birthdate: "",
            photoId: "",
            email,
            phone: ""
        },
        shipsOwned: [],
        history: []
    };

    // Add user to users object
    users[licenseId] = newUser;

    // Write updated users object to users.json file
    fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        
        res.status(200).send('User registered successfully');
    });
});

module.exports = router;