const logging = require("../config/logging.json")
const db = require("../modules/db.js")
module.exports = (app) => {
    app.post("/create", async (req, res) => {
        const { body } = req
        await db.client.connect()
        if(!body || !body.flag || !body.value) return res.status(400).json({ success: false, message: "Flag or value not provided" })
        const flag = await db.collections.fflags.findOne({ flag: body.flag })
        if(flag) return res.status(400).json({ success: false, message: "Flag already exists" })
        
        if(logging.logChanges || (logging.whitelist && body.flag in logging.whitelistedFlags)) {
            var logMessage = `${body.flag} was created with value ${body.value}`
            if(typeof body.value == "boolean"){
                logMessage = `${body.flag} was created with value ${body.value == true ? "✅" : "❌"}`
            }

            await db.collections.logs.insertOne({ flag: body.flag, message: logMessage, time: Date.now() })
        }

        await db.collections.fflags.insertOne({ flag: body.flag, value: body.value, locked: false })
        await db.client.close()

        res.status(400).json({ success: true, message: "Flag has been created"})
    })
    return {
        method: "POST",
        route: "/create"
    }
}