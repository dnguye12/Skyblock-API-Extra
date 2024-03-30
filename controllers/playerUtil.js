const axios = require('axios')
const config = require('../utils/config')
const { getNetworth } = require('skyhelper-networth')
const Player = require('../models/player')

const isValidUUID = (uuid) => {
    const fullUUIDPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    const trimmedUUIDPattern = /^[0-9a-fA-F]{32}$/

    return fullUUIDPattern.test(uuid) || trimmedUUIDPattern.test(uuid)
}

const trimUUID = (uuid) => {
    return uuid.replace(/-/g, '');
}

const getNetworthUtil = async (uuid) => {
    try {
        uuid = trimUUID(uuid)

        const player = await Player.findById(uuid)
        let dbAge = -1
        if (player) {
            dbAge = new Date() - player.updatedAt
        }
        const res = {}

        if (!player || dbAge > 3600000) {
            const profiles = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${config.APIKEY}&uuid=${uuid}`).then(res => res.data.profiles)

            if (!profiles || profiles.length === 0) {
                res.status = 500
                res.error = "Player has no SkyBlock profiles."
                return res
            }

            res.status = 200

            res.displayName = await axios.get(`https://api.minetools.eu/profile/${uuid}`).then(res => res.data.decoded.profileName)
            res.profiles = []

            for (const profile of profiles) {
                const museumData = await axios.get(`https://api.hypixel.net/v2/skyblock/museum?key=${config.APIKEY}&profile=${uuid}`)
                const profileData = profile.members[`${uuid}`];
                const bankBalance = profile.banking?.balance;

                const networth = await getNetworth(profileData, bankBalance, { v2Endpoint: true, museumData, cache: true })

                res.profiles = [...res.profiles, {
                    "profile_id": profile.profile_id,
                    "game_mode": profile.game_mode ? profile.game_mode : "classic",
                    "networth": networth
                }]
            }

            const newPlayer = new Player({
                _id: uuid,
                displayName: res.displayName,
                profiles: res.profiles
            })
            await newPlayer.save()
        } else {
            res.status = 200
            res.displayName = player.displayName
            res.profiles = player.profiles
        }
        return res

    } catch (error) {
        if (error.response && (error.response.status === 400 || error.response.status === 403 || error.response.status === 422 || error.response.status === 429)) {
            return {
                "status": error.response.status,
                "error": error.response.data.cause
            }
        } else {
            console.log(error)
        }
    }
}


module.exports = { isValidUUID, getNetworthUtil }