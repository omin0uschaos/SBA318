const express = require("express");
const router = express.Router();
const fs = require('fs');

const ships = require("../data/ships");

// Define the number of ships to display per page
const shipsPerPage = 5;

router.get("/", (req, res) => {
    const page = parseInt(req.query.page) || 1; // Get the page number from query params or default to 1
    const startIndex = (page - 1) * shipsPerPage;
    const endIndex = startIndex + shipsPerPage;

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

// Helper function to render pagination links
function renderPaginationLinks(currentPage, totalShips) {
    const totalPages = Math.ceil(totalShips / shipsPerPage);
    let paginationLinks = '<div class="pagination">';

    if (totalPages > 1) {
        if (currentPage > 1) {
            paginationLinks += `<a href="?page=${currentPage - 1}">Previous</a>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationLinks += `<a href="?page=${i}" class="${i === currentPage ? 'active' : ''}">${i}</a>`;
        }

        if (currentPage < totalPages) {
            paginationLinks += `<a href="?page=${currentPage + 1}">Next</a>`;
        }
    }

    paginationLinks += '</div>';
    return paginationLinks;
}

module.exports = router;
