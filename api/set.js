const db = require("../modules/db.js")
module.exports = (app) => {
    app.post("/set", async (req, res) => {
        const { body } = req

        if(!body || !body.flag || !body.value) {
            return res.status(400).json({ success: false, message: "Flag or Value not provided"})
        }

        await db.client.connect()
        const flag = await db.collections.fflags.findOne({ flag: body.flag })
        if(!flag) return res.status(404).json({ success: false, message: "Flag not found (Use /create to make a new one)" })

        await db.collections.fflags.updateOne({ flag: body.flag }, { "$set": {
            value: body.value
        }})

        res.status(200).json({ success: true, message: `Set value of ${body.flag}` })
    })
    return {
        method: "POST",
        route: "/set"
    }
}