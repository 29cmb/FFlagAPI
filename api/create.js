const db = require("../modules/db.js")
module.exports = (app) => {
    app.post("/create", async (req, res) => {
        const { body } = req
        await db.client.connect()
        if(!body || !body.flag || !body.value) return res.status(400).json({ success: false, message: "Flag or value not provided" })
        const flag = await db.collections.fflags.findOne({ flag: body.flag })
        if(flag) return res.status(400).json({ success: false, message: "Flag already exists" })
        
        await db.collections.fflags.insertOne({ flag: body.flag, value: body.value, locked: false })
        await db.client.close()

        res.status(400).json({ success: true, message: "Flag has been created"})
    })
    return {
        method: "POST",
        route: "/create"
    }
}