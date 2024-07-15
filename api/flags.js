const db = require("../modules/db.js")
module.exports = (app) => {
    app.get("/flags", async (req, res) => {
        await db.client.connect()
        res.json({success: true, data: await db.collections.fflags.find().toArray() || []})
    })
    return {
        method: "GET",
        route: "/flags"
    }
}