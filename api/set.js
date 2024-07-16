const logging = require("../config/logging.json")
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
        if(flag.locked == true) res.status(403).json({ success: false, message: "Selected flag is locked and is read only."})

        if(logging.logChanges || (logging.whitelist && body.flag in logging.whitelistedFlags)) {
            var logMessage = `${body.flag} was set to value ${body.value}, old value ${flag.value}`
            if(typeof body.value == "boolean"){
                logMessage = `${body.flag} was changed from ${typeof flag.value == "boolean" ? (flag.value == true ? "✅" : "❌") : flag.value} -> ${body.value == true ? "✅" : "❌"}`
            }

            await db.collections.logs.insertOne({ flag: body.flag, message: logMessage, time: Date.now() })
        }

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