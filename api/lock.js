const db = require("../modules/db.js")
module.exports = (app) => {
    app.post("/api/lock", async (req, res) => {
        const { body } = req
        if(!body || !body.flag) return res.status(400).json({ success: false, message: "Flag not provided" })

        await db.client.connect()
        const flag = await db.collections.fflag.findOne({ flag: body.flag })
        if(!flag) return res.status(404).json({ success: false, message: "Flag not found or not registered" })

        await db.collections.fflag.updateOne({ flag: body.flag }, {"$set": {
            locked: true
        }})

        res.status(200).json({ success: true, message: "Flag has been locked" })
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/lock"
    }
}