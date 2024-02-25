const express = require("express");
const router = express.Router();
const fs = require('fs');

const users = require("../data/users");


router.get("/user/:userId", (req, res) => {
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
            content: `
                <h2>User Information</h2>
                <p>Name: ${user.personData.name}</p>
                <p>Email: ${user.personData.email}</p>
                <p>Address: ${user.personData.Address}</p>
                <!-- Add more user information as needed -->
            `
        };
        res.render("index", options);
    });
});

router.get("/login", (req, res) => {
    const options = {
        title: "Login",
        subTitle: "Login to your account",
        content: `
            <div id="login-form">
                <h2>Login</h2>
                <form action="/login" method="POST">                            
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                    </div>

                    <button type="submit">Login</button>
                </form>
            </div>
        `
    };
    res.render("register", options);
});

module.exports = router;