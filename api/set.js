const logging = require("../config/logging.json")
const db = require("../modules/db.js")
const sendLogEvent = require("../modules/sendLogEvent.js")
module.exports = (app) => {
    app.post("/api/set", async (req, res) => {
        const { body } = req

        if(body == undefined || body.flag == undefined || body.value == undefined) {
            return res.status(400).json({ success: false, message: "Flag or Value not provided"})
        }

        await db.client.connect()
        const flag = await db.collections.fflags.findOne({ flag: body.flag })
        if(!flag) return res.status(404).json({ success: false, message: "Flag not found (Use /create to make a new one)" })
        if(flag.locked == true) return res.status(403).json({ success: false, message: "Selected flag is locked and is read only."})

        if(logging.logChanges || (logging.whitelist && body.flag in logging.whitelistedFlags)) {
            var logMessage = `${body.flag} was set to value ${body.value}, old value ${flag.value}`
            if(typeof body.value == "boolean" || typeof flag.value == "boolean"){
                logMessage = `${body.flag} was changed from ${typeof flag.value == "boolean" ? (flag.value == true ? "✅" : "❌") : flag.value} -> ${typeof body.value == "boolean" ? (body.value == true ? "✅" : "❌") : body.value}`
            }

            await db.collections.logs.insertOne({ flag: body.flag, message: logMessage, time: Date.now() })
            await sendLogEvent(logMessage)
        }
        
        await db.collections.fflags.updateOne({ flag: body.flag }, { "$set": {
            value: body.value
        }})

        res.status(200).json({ success: true, message: `Set value of ${body.flag}`, old: flag.value })
    })
    return {
        method: "POST",
        route: "/api/set"
    }
}