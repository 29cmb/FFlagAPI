const logging = require("../config/logging.json")
const db = require("../modules/db.js")
const sendLogEvent = require("../modules/sendLogEvent.js")
module.exports = (app) => {
    app.post("/api/delete", async (req, res) => {
        const { body } = req
        await db.client.connect()
        if(body == undefined || body.flag == undefined) return res.status(400).json({ success: false, message: "Flag not provided" })
        const flag = await db.collections.fflags.findOne({ flag: body.flag })
        if(!flag) return res.status(400).json({ success: false, message: "Flag does not exist" })
        
        if(logging.logChanges || (logging.whitelist && body.flag in logging.whitelistedFlags)) {
            var logMessage = `${body.flag} was removed with value ${body.value}`
            if(typeof body.value == "boolean"){
                logMessage = `${body.flag} was removed with value ${body.value == true ? "✅" : "❌"}`
            }

            await db.collections.logs.insertOne({ flag: body.flag, message: logMessage, time: Date.now() })
            await sendLogEvent(logMessage)
        }

        await db.collections.fflags.deleteOne({ flag: body.flag  })
        await db.client.close()

        res.status(200).json({ success: true, message: "Flag has been deleted"})
    })
    return {
        method: "POST",
        route: "/api/delete"
    }
}