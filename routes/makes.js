const express = require("express");
const router = express.Router();
const makes = require("../data/makes");

router.get("/", (req, res) => {
    const makesList = Object.keys(makes);

    let html = "";
    html += "<ul>";
    makesList.forEach(make => {
        html += `<li><h3>${make.charAt(0).toUpperCase()
            + make.slice(1)}</h3> <img src="/images/ships/${make}.png" alt="${make} logo"></li><br>`;
    });
    html += "</ul>";
    const options = {
        title: "Manufacturers",
        subTitle: "Ship Manufacturers Master List",
        content: `
            <div id="makes-page-div">
                <h2>Makes</h2>
                ${html}
            </div>
        `
    };

    res.render("ships", options);
});

router.get("/:makeId", (req, res) => {
    const makeId = req.params.makeId;
    const make = makes[makeId];
    if (!make) {
        return res.status(404).send("Make not found");
    }

    const options = {
        title: `${make.manufacturerName}`,
        subTitle: `${make.manufacturerName} Spaceships`,
        content: `
            <h2>${make.manufacturerName} Spaceships</h2>
            <div class="make-info">
                <p><strong>Location:</strong> ${make.location}</p>
                <p><strong>Description:</strong> ${make.description}</p>
            </div>
            <h3>Models:</h3>
            <ul>
                ${make.models.map(model => `<li>${model}</li>`).join('')}
            </ul>
            <h3>Exterior Colors:</h3>
            <ul>
                ${make.extColors.map(color => `<li>${color}</li>`).join('')}
            </ul>
            <h3>Interior Colors:</h3>
            <ul>
                ${make.intColors.map(color => `<li>${color}</li>`).join('')}
            </ul>
        `
    };
    res.render("ships", options);
});

module.exports = router;
