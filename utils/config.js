require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const APIKEY = process.env.APIKEY

module.exports = {
    PORT, MONGODB_URI, APIKEY
}