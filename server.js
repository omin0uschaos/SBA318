const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const methodOverride = require('method-override');
const fs = require('fs');
const usersRouter = require("./routes/users");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const shipsRouter = require("./routes/ships");
const makesRouter = require("./routes/makes");
const wishlistRouter = require("./routes/wishlist");
const loggingMiddleware = require('./middlewares/logging');

const errorHandler = require('./utilities/errorHandler');


const session = require("express-session");



const app = express();
let PORT = 3000

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

//attempted to set up session for login, unfortunately was not able to implement 
app.use(session({
    secret: "spacemen-never-die",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(__dirname + "/styles"));

app.use('/images', express.static('images'));
app.use(express.urlencoded({ extended: true }));

app.use(loggingMiddleware);

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
app.use("/users", usersRouter);
app.use("/ships", shipsRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/makes", makesRouter);
app.use("/wishlist", wishlistRouter);


app.get('/', (req, res)=>{
    const options = {
        homelink:"/",
        contactlink:"/contact",
        title: "Intergalactic Ship Registry",
        subTitle: `<img id="isrtext-logo" src="/images/isrtext.svg"><br><hr>INTERGALACTIC SHIP REGISTRY`,
        content: ` <br /><br />`
    };
    res.render("index", options);
})

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
})