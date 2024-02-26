const express = require("express");
const router = express.Router();
const fs = require('fs');
const wishlist = require("../data/wishlist");
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

router.get("/", (req, res) => {
    fs.readFile('./data/wishlist.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        try {
            const wishlistData = JSON.parse(data);

            const wishlistItems = wishlistData.map((item, index) => {
                const manufacturer = item.manufacturer || "";
                const model = item.model || "";
                const dateTimeAdded = item.timestamp || "";

                return `
                    <li><a href="/makes/${manufacturer.toLowerCase()}"><img src="./images/ships/${manufacturer.toLowerCase()}/${model}.png" alt="${model}"></a>
                        ${manufacturer} - ${model} (${dateTimeAdded})
                        <form action="/wishlist/${index}?_method=DELETE" method="POST">
                        <input type="hidden" name="_method" value="DELETE"> <!-- Method override -->
                        <button type="submit">Delete</button>
                        </form>
                    </li>
            `;
            });

            const options = {
                title: "Wishlist",
                subTitle: "Items in Wishlist",
                // Join wishlist items into a single string
                content: `<ul>${wishlistItems.join('')}</ul>` 
            };

            res.render("wishlist", options);
        } catch (parseError) {
            console.error("Error parsing wishlist data:", parseError);
            return res.status(500).send('Error parsing wishlist data');
        }
    });
});

router.delete("/:index", (req, res) => {
    const index = req.params.index;

    // Check if index is valid
    if (index >= 0 && index < wishlist.length) {
        // Remove item from wishlist array
        wishlist.splice(index, 1);

        // Write the updated wishlist array to the wishlist JSON file
        fs.writeFile("./data/wishlist.json", JSON.stringify(wishlist, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error updating wishlist");
            }
            res.redirect("/wishlist");
        });
    } else {
        res.status(404).send("Item not found in wishlist");
    }
});





router.post("/", (req, res) => {
    const { manufacturer, model } = req.body;

    // Check if the item already exists in the wishlist
    if (wishlist.some(item => item.manufacturer === manufacturer && item.model === model)) {
        return res.status(400).send("Item already exists on the wishlist");
    }

    const timestamp = new Date().toDateString();
    const newItem = { manufacturer, model, timestamp };

    wishlist.push(newItem);

    // Write the updated wishlist array to the wishlist JSON file
    fs.writeFile("./data/wishlist.json", JSON.stringify(wishlist, null, 2), err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error adding item to wishlist");
        }
        res.redirect("/wishlist");
    });
});


module.exports = router;
