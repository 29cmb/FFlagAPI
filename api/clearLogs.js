const db = require("../modules/db.js")
module.exports = (app) => {
    app.post("/api/clearLogs", async (req, res) => {
        const result = await db.collections.logs.deleteMany({})
        res.json({ success: true, message: `Deleted ${result.deletedCount} logs` })
    })

    return {
        method: "POST",
        route: "/api/clearLogs"
    }
}