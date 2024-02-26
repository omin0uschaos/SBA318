const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const users = require("../data/users");

router.get("/", (req, res) => {
    // If user is already logged in, redirect to admin page
    if (req.session.userId) {
        return res.redirect("/admin");
    }

    const options = {
        title: "Login",
        subTitle: "Login to your account(WIP)",
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
    res.render("login", options);
});

router.post("/", (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const user = Object.values(users).find(user => user.username === username);

    // If user not found, or password is incorrect, display error message
    if (!user || !bcrypt.compareSync(password, user.password)) {
        const options = {
            title: "Login",
            subTitle: "Login to your account (WIP)",
            errorMessage: "Invalid username or password.",
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
        return res.render("login", options);
    }

    // If username and password are correct, store user id in session and redirect to admin route
    req.session.userId = user.id;
    res.redirect("/admin");
});

module.exports = router;
