const express = require("express");
const router = express.Router();
const fs = require('fs');

const ships = require("../data/ships");

router.get("/search", (req, res) => {
    // Render only the search form initially
    const options = {
        title: "Owned Ship Search",
        subTitle: "Search for Ships",
        content: `
            <h2>Ship Search</h2>
            <form action="/ships/search/results" method="GET">
                <input type="text" name="searchTerm" placeholder="Search...">
                <button type="submit">Search</button>
            </form>
        `
    };

    res.render("ships", options);
});

router.get("/search/results", (req, res) => {
    const searchTerm = req.query.searchTerm;
    
    // If no search term provided, render search form again
    if (!searchTerm) {
        const options = {
            title: "Owned Ship Search",
            subTitle: "Search for Ships",
            content: `
                <h2>Ship Search</h2>
                <form action="/ships/search/results" method="GET">
                    <input type="text" name="searchTerm" placeholder="Search...">
                    <button type="submit">Search</button>
                </form>
                <p>Please enter a search term.</p>
            `
        };

        return res.render("results", options);
    }

    // Filter ships based on search term (case-insensitive)
    const filteredShips = Object.values(ships).filter(ship => {
        // Convert all fields to lowercase for case-insensitive search
        const lowerSearchTerm = searchTerm.toLowerCase();
        const lowerShipId = ship.shipId.toLowerCase();
        const lowerShipName = ship.shipName.toLowerCase();
        const lowerMake = ship.shipInfo[0].make.toLowerCase();
        const lowerOwnerName = ship.ownerInfo.name.toLowerCase();
        const lowerOwnerId = ship.ownerInfo.ownerId.toLowerCase();

        return (
            lowerShipId.includes(lowerSearchTerm) ||
            lowerShipName.includes(lowerSearchTerm) ||
            lowerMake.includes(lowerSearchTerm) ||
            lowerOwnerName.includes(lowerSearchTerm) ||
            lowerOwnerId.includes(lowerSearchTerm)
        );
    });

    // Render search results
    const options = {
        title: "Ship Search Results",
        subTitle: "Search Results",
        content: `
            <h2>Ship Search</h2>
            <form action="/ships/search/results" method="GET">
                <input type="text" name="searchTerm" placeholder="Search...">
                <button type="submit">Search</button>
            </form>
            <h2>Ship Search Results</h2>
            <p>Search Term: ${searchTerm}</p><hr><br />
            <ul id="search-result-ul">
                ${filteredShips.map(ship => `
                    <li>
                    <img src="/images/ships/${ship.shipInfo[0].make.toLowerCase().replace(/\s+/g, '')}/${ship.shipInfo[0].model}.png" alt="ISR">
                        <p>Ship Name: ${ship.shipName}</p>
                        <p>Ship ID: ${ship.shipId}</p>
                        <p>Make: ${ship.shipInfo[0].make}</p>
                        <p>Owner Name: ${ship.ownerInfo.name}</p>
                        <p>Owner ID: ${ship.ownerInfo.ownerId}</p>
                    </li><br>
                `).join('')}
            </ul>
        `
    };

    res.render("results", options);
});

module.exports = router;
