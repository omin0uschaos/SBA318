function generateUserID(username) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Choose random starting alphabet letter
    let userID = alphabet.charAt(Math.floor(Math.random() * alphabet.length)); 
    
    // Generate 7 random digits
    for (let i = 0; i < 7; i++) {
        userID += Math.floor(Math.random() * 10);
    }
    
    return userID;
}

function generateShipId() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 10;
    let shipId = '';

    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        shipId += characters[randomIndex];
    }

    return shipId;
}

function generateRegPlate() {
    const characters = 'ABCDEFGHI123456789JKLMNOPQRSTU012345678VWXYZ12345789';
    const idLength = 12;
    let regPlate = '';

    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        regPlate += characters[randomIndex];
    }

    return regPlate;
}

module.exports = {
    generateUserID: generateUserID,
    generateShipId: generateShipId,
    generateRegPlate: generateRegPlate
};
const username = 'sampleUser';
const userID = generateUserID(username);