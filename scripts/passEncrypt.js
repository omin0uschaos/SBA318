const bcrypt = require("bcrypt");

async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
}

async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    console.log(result);
    return result;
}

async function processPassword() {
    let ogpass = "password123";
    let pass = "password123";
    pass = await hashPassword(pass);
    console.log(pass);
    comparePassword(ogpass, pass);
}

processPassword();