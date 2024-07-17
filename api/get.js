const logging = require("../config/logging.json")
const db = require("../modules/db.js")
const sendLogEvent = require("../modules/sendLogEvent.js")
module.exports = (app) => {
    app.post("/api/get", async (req, res) => {
        const { body } = req
        await db.client.connect()
        if(body == undefined || body.flag == undefined) return res.status(400).json({ success: false, message: "Flag not provided" })
        const flag = await db.collections.fflags.findOne({ flag: body.flag })
        if(!flag) return res.status(400).json({ success: false, message: "Flag does not exist" })

        await db.client.close()

        res.status(200).json({ success: true, value: flag.value })
    })
    return {
        method: "POST",
        route: "/api/get"
    }
}