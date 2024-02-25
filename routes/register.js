const express = require("express");
const router = express.Router();
const fs = require('fs');

const users = require("../data/users");
const ships = require("../data/ships");
const makes = require("../data/makes");


router.get("/register", (req, res) => {
    const userId = req.params.userId;
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        
        const users = JSON.parse(data);
        const user = users[userId];
        if (!user) {
            return res.status(404).send('User not found');
        }

        const options = {

            title: `User Profile - ${user.username}`,
            subTitle: `User ID: ${user.personData.name}`,
            content: `<div id="user-registration-form">
                        <h2>User Registration</h2>
                        <form action="/register" method="POST">
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
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <button type="submit">Register</button>
                        </form>
                    </div>
        
            `
        };
        res.render("index", options);
    });
});

module.exports = router;