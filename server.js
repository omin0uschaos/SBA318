const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")

const app = express();
let PORT = 3000

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(express.static(__dirname + "/styles"));

app.use('/images', express.static('images'));
app.use(express.urlencoded({ extended: true }));
const fs = require('fs');

app.engine("europa", (filePath, options, callback) =>{
    fs.readFile(filePath, (err, content) =>{
        if (err) return callback(err);

        const rendered = content
        .toString()
        .replaceAll("#title#", `${options.title}`)
        .replace('#sub-title#', `${options.subTitle}`)
        .replace('#content#', `${options.content}`)
        .replace('#link4#', `${options.contactlink}`)
        .replace("#link1#", `${options.homelink}`);
        return callback(null, rendered);
    });
});

app.set("pages", "./views");
app.set("view engine", "europa");



app.get('/', (req, res)=>{
    const options = {
        homelink:"/",
        contactlink:"/contact",
        title: "This is the Home Page",
        subTitle: "Welcome to the wonderful world of Europa",
        content: `Europa is a place that holds unilimited possibilities. Please read more about it below. <br /><br />`
    };
    res.render("index", options);
})


app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
})