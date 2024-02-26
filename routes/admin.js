const express = require("express");
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcrypt');

const users = require("../data/users");

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect("/login");
    }
};

router.get("/", isLoggedIn, (req, res) => {
    const userId = req.session.userId;
    const user = users[userId];

    if (!user) {
        return res.status(404).send("User not found");
    }

    const options = {
        title: "Account Info",
        subTitle: "Your Account Information",
        content: `
            <h2>Account Information</h2>
            <form action="/admin/update" method="POST">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" value="${user.personData.name}" required>
                </div>
                <div class="form-group">
                    <label for="address">Address:</label>
                    <input type="text" id="address" name="address" value="${user.personData.Address}" required>
                </div>
                <div class="form-group">
                    <label for="birthdate">Birthdate:</label>
                    <input type="text" id="birthdate" name="birthdate" value="${user.personData.Birthdate}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${user.personData.email}" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone:</label>
                    <input type="text" id="phone" name="phone" value="${user.personData.phone}" required>
                </div>
                <button type="submit">Update Info</button>
            </form>
            <h2>Ships Owned</h2>
            <ul>
                ${user.shipsOwned.map(ship => `
                    <li>
                        ${ship.shipName} - ${ship.shipId} 
                        <form action="/admin/delete-ship" method="POST">
                            <input type="hidden" name="shipId" value="${ship.shipId}">
                            <button type="submit">Delete</button>
                        </form>
                    </li>
                `).join('')}
            </ul>
            <h2>Add New Ship</h2>
            <form action="/admin/add-ship" method="POST">
                <div class="form-group">
                    <label for="shipName">Ship Name:</label>
                    <input type="text" id="shipName" name="shipName" required>
                </div>
                <div class="form-group">
                    <label for="shipId">Ship ID:</label>
                    <input type="text" id="shipId" name="shipId" required>
                </div>
                <button type="submit">Add Ship</button>
            </form>
        `
    };
    res.render("admin", options);
});

router.post("/update", isLoggedIn, (req, res) => {
    const userId = req.session.userId;
    const { name, address, birthdate, email, phone } = req.body;

    // Update user information
    users[userId].personData = { name, Address: address, Birthdate: birthdate, email, phone };
    
    // Write updated user data to file
    fs.writeFile("data/users.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect("/admin");
    });
});

router.post("/add-ship", isLoggedIn, (req, res) => {
    const userId = req.session.userId;
    const { shipName, shipId } = req.body;

    // Add new ship to user's list of owned ships
    users[userId].shipsOwned.push({ shipName, shipId });
    
    // Write updated user data to file
    fs.writeFile("data/users.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect("/admin");
    });
});

router.post("/delete-ship", isLoggedIn, (req, res) => {
    const userId = req.session.userId;
    const shipIdToDelete = req.body.shipId;

    // Find index of ship to delete
    const indexToDelete = users[userId].shipsOwned.findIndex(ship => ship.shipId === shipIdToDelete);

    if (indexToDelete === -1) {
        return res.status(404).send("Ship not found");
    }

    // Remove ship from user's list of owned ships
    users[userId].shipsOwned.splice(indexToDelete, 1);
    
    // Write updated user data to file
    fs.writeFile("data/users.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect("/admin");
    });
});

module.exports = router;
