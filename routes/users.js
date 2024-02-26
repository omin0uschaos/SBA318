const express = require("express");
const router = express.Router();
const fs = require('fs');

const users = require("../data/users");


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
            return `<div>
                        <p>Name: ${user.name}</p>
                        <p>License ID: ${user.licenseId}</p>
                        <p>Ships Owned: ${user.shipsOwned}</p><br><br>
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
            return res.status(404).send('User not found');
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
                <p>Email: ${email}</p>
                <p>Address: ${address}</p>
                <p>Ships Owned: ${shipsOwned}</p>
            `
        };
        res.render("users", options);
    });
});


module.exports = router;