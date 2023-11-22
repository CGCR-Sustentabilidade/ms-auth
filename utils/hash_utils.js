const bcrypt = require('bcrypt');

async function ConvStringToHash(password) {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.log('error: ', error)
        return null
    }
}

module.exports = {
    ConvStringToHash,
};