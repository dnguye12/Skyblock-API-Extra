const { isValidUUID, getNetworthUtil } = require('./playerUtil')

const playerRouter = require('express').Router()

playerRouter.get('/networth', async (request, response) => {
    const uuid = request.query.uuid
    if (!uuid) {
        return response.status(400).json({ error: 'Missing field [uuid]' })
    }
    if (!isValidUUID(uuid)) {
        return response.status(422).json({ error: 'Malformed UUID' })
    }

    res = await getNetworthUtil(uuid)
    statut = res.status
    delete res.status
    return response.status(statut).json(res)
})

module.exports = playerRouter