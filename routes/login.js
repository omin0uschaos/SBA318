const express = require("express");
const router = express.Router();
const fs = require('fs');

const users = require("../data/users");


router.get("/", (req, res) => {
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