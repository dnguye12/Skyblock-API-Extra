const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const profileSchema = new mongoose.Schema({
    profile_id: String,
    game_mode: String,
    networth: Object
}, { _id: false })

const playerSchema = new mongoose.Schema({
    _id: String,
    displayName: String,
    profiles: [profileSchema]
}, { timestamps: true })

playerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Player', playerSchema)