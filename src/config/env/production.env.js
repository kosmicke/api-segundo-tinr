module.exports = {
    mongo: {
        uri: process.env.MONGO_URI,
        debug : true,
        options: {
            user: process.env.MONGO_USER,
            pass: process.env.MONGO_PASSWORD,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    encryptionKey: process.env.ENCRYPT_KEY
};