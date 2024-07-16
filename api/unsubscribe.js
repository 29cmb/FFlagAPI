const db = require("../modules/db.js")
module.exports = (app) => {
    app.post("/unsubscribe", async (req, res) => {
        const { body } = req
        if(!body || !body.url) return res.status(400).json({ success: false, message: "Webhook URL not provided" })
        await db.client.connect()
        const webhook = await db.collections.webhooks.findOne({ url })
        if(!webhook) return res.status(400).json({ success: false, message: "Webhook is not registered" })
        
        await db.collections.webhooks.deleteOne({ url })
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/unsubscribe"
    }
}