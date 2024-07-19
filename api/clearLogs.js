const db = require("../modules/db.js")
module.exports = (app) => {
    app.post("/api/clearLogs", async (req, res) => {
        await db.client.connect()
        const result = await db.collections.logs.deleteMany({})
        res.json({ success: true, message: `Deleted ${result.deletedCount} logs` })
        await db.client.close()
    })

    return {
        method: "POST",
        route: "/api/clearLogs"
    }
}