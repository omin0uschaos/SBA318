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

const username = 'sampleUser';
const userID = generateUserID(username);
console.log(userID);
