const { isValidUUID, getNetworthUtil } = require('./playerUtil')


const playerRouter = require('express').Router()

playerRouter.get('/networth', async (request, response) => {
    const { key, uuid } = request.query
    if (!key) {
        return response.status(400).json({ error: 'Missing API-Key header' })
    }
    if (!isValidUUID(key)) {
        return response.status(403).json({ error: 'Malformed API key' })
    }
    if (!uuid) {
        return response.status(400).json({ error: 'Missing field [uuid]' })
    }
    if (!isValidUUID(uuid)) {
        return response.status(422).json({ error: 'Malformed UUID' })
    }

    res = await getNetworthUtil(key, uuid)
    statut = res.status
    delete res.status
    return response.status(statut).json(res)
})

module.exports = playerRouter