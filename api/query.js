const db = require("../modules/db.js")
module.exports = (app) => {
    app.post("/api/query", async (req, res) => {
        const { body } = req
        if(body == undefined || body.query == undefined) return res.status(500).json({ success: false, messahe: "Query not provided" })
        
        const queryType = body.queryType || "equals"
        await db.client.connect()
        var data

        if(queryType == "contains"){
            data = await db.collections.flags.find({ value: { $regex: body.query, $options: "i" } })
        } else if(queryType == "starts"){
            data = await db.collections.flags.find({ value: { $regex: `^${body.query}`, $options: "i" }})
        } else if(queryType == "ends") {
            data = await db.collections.flags.find({ value: { $regex: `${body.query}$`, $options: "i" }})
        } else {
            data = await db.collections.flags.find({ value: body.query })
        }

        data = data.toArray()
        
        await db.client.close()

        res.json({ success: true, data })
    })
    return {
        method: "POST",
        route: "/api/query"   
    }
}