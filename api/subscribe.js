const db = require("../modules/db.js")
module.exports = (app) => {
    app.post("/subscribe", async (req, res) => {
        const { body } = req
        const { url } = body
        if(!body || !url) return res.status(400).json({ success: false, message: "Webhook URL not provided" })
        await db.client.connect()
        const webhook = await db.collections.webhooks.findOne({ url })
        if(webhook) return res.status(400).json({ success: false, message: "Webhook is already registered" })
        
        await db.collections.webhooks.insertOne({ url })
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/subscribe"
    }
}