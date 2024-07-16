const db = require("../modules/db.js")
module.exports = (app) => {
    app.get("/logs", async (req, res) => {
        await db.client.connect()
        res.json({success: true, data: await db.collections.logs.find().toArray() || []})
    })
    return {
        method: "GET",
        route: "/logs"
    }
}