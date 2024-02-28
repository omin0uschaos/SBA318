const express = require("express");
const router = express.Router();
const fs = require('fs');

const users = require("../data/users");
const { generateUserID, generateShipId, generateRegPlate } = require('../scripts/idGen.js');

router.get("/", (req, res) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        
        const usersData = JSON.parse(data);

        const userList = Object.keys(usersData).map(userId => {
            const user = usersData[userId];

            const name = user.personData ? user.personData.name : user.name || "";
            const licenseId = user.licenseData ? user.licenseData.licenseId : user.licenseId || "";
            const shipsOwned = Array.isArray(user.shipsOwned) ? user.shipsOwned.length : 0;
            return { name, licenseId, shipsOwned };
        });

        const htmlContent = userList.map(user => {
            return `<div><a href="/users/${user.licenseId}">
                        <p>Name: ${user.name}</p>
                        <p>License ID: ${user.licenseId}</p>
                        <p>Ships Owned: ${user.shipsOwned}</p></a>
                    </div>`;
        }).join('');

        const options = {
            title: "User List",
            subTitle: "List of Registered Users",
            content: htmlContent
        };

        res.render("users", options);
    });
});

router.get("/:userId", (req, res) => {
    const userId = req.params.userId;
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        
        const usersData = JSON.parse(data);
        const user = usersData[userId];
        
        if (!user) {
            const options = {
                title: "Intergalactic Ship Registry",
                subTitle: `Error!`,
                content: `Sorry, User not found!`
            };
            return res.status(404).render("error", options);
        }

        const name = user.personData ? user.personData.name : user.name || "";
        const licenseId = user.licenseData ? user.licenseData.licenseId : user.licenseId || "";
        const email = user.personData ? user.personData.email : "";
        const address = user.personData ? user.personData.Address : "";
        const shipsOwned = Array.isArray(user.shipsOwned) ? user.shipsOwned.length : 0;

        const options = {
            title: `User Profile - ${name}`,
            subTitle: `User ID: ${licenseId}`,
            content: `
                <h2>User Information</h2>
                <p>Name: ${name}</p>
                <p>License ID: ${licenseId}</p>
                <p>Ships Owned: ${shipsOwned}</p><br>
                <a id="user-page-add" href="/users/${licenseId}/addship">Add Ships</a>
            `
        };
        res.render("users", options);
    });
});

router.get("/:userId/addship", (req, res) => {
    const userId = req.params.userId;
    const options = {
        title: `Add ship to - ${userId}`,
        subTitle: `Add Ships to User ID: <a id="user-page-link" href="/users/${userId}">${userId}</a>`,
        content: `
        <h1>Add New Ship</h1>
        `
    };

    res.render("useraddship", options);
});

// PATCH route to add the ship to ships.json and update users.json
router.patch("/:userId/addship", (req, res) => {
    const userId = req.params.userId;
    const { shipName, manufacturer, model, exteriorColor, interiorColor, usage } = req.body;

    console.log("Form Data:", req.body);
    const shipId = generateShipId();

    // Read users.json to get owner's name
    fs.readFile('./data/users.json', 'utf8', (err, userData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        // Parse users data
        const users = JSON.parse(userData);

        // Find user by ID
        const user = users[userId];
        if (!user) {
            const options = {
                title: "Intergalactic Ship Registry",
                subTitle: `Error!`,
                content: `Sorry, User not found!`
            };
            return res.status(404).render("error", options);
        }

        // Prepare ship data
        const newShipData = {
            shipName,
            shipId,
            shipInfo: [{
                make: manufacturer,
                model,
                extColor: exteriorColor,
                intColor: interiorColor,
                usage
            }],
            registryData: {
                regPlate: generateRegPlate(),
                issuedYear: new Date().getFullYear(),
                expiration: new Date().getFullYear() + 5,
                status: "active"
            },
            ownerInfo: {
                name: user.name,
                ownerId: userId
            },
            history: []
        };

        // Read ships.json
        fs.readFile('./data/ships.json', 'utf8', (err, shipsData) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            // Parse ships data
            let ships = JSON.parse(shipsData);

            // Add the new ship to the ships data
            ships[shipId] = newShipData;

            // Update ships.json
            fs.writeFile("./data/ships.json", JSON.stringify(ships, null, 2), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error updating ships data");
                }

                // Add ship to user's shipsOwned array
                user.shipsOwned.push({ shipId });

                // Update users.json
                fs.writeFile("./data/users.json", JSON.stringify(users, null, 2), err => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Error updating user's ships");
                    }

                    // Redirect to user profile page
                    res.redirect(`/users/${userId}`);
                });
            });
        });
    });
});






module.exports = router;