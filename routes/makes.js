const express = require("express");
const router = express.Router();
const fs = require('fs');

const makes = require("../data/makes");


router.get("/", (req, res) => {

    fs.readFile('./data/ships.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        
        const allShips = JSON.parse(data);
        const shipIds = Object.keys(allShips);
        const paginatedShips = shipIds.slice(startIndex, endIndex).map(shipId => allShips[shipId]);

        const options = {
            title: `Ships Page - Page ${page}`,
            subTitle: `Displaying ships ${startIndex + 1} to ${Math.min(endIndex, shipIds.length)} out of ${shipIds.length}`,
            content: `
                <h2>Ships</h2>
                <div id="ships">
                    ${paginatedShips.map(ship => `
                        <div class="ship">
                            <h3>${ship.shipName}</h3>
                            <p>Make: ${ship.shipInfo[0].make}</p>
                            <p>Model: ${ship.shipInfo[0].model}</p>
                            <p>Year: ${ship.shipInfo[0].year}</p>
                            <p>Exterior Color: ${ship.shipInfo[0].extColor}</p>
                            <p>Interior Color: ${ship.shipInfo[0].intColor}</p>
                            <p>Usage: ${ship.shipInfo[0].usage}</p>
                            <p>Registry Plate: ${ship.registryData.regPlate}</p>
                            <p>Owner: ${ship.owerInfo.name}</p>
                        </div>
                    `).join('')}
                </div>
                ${renderPaginationLinks(page, shipIds.length)}
            `
        };
        res.render("ships", options);
    });
});

module.exports = router;
