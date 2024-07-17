const db = require("../modules/db.js")
module.exports = (app) => {
    app.post("/bulkUpdate", async (req, res) => {
        const { body } = req
        if(body == undefined || body.flags == undefined || body.flags.constructor !== Array) return res.status(500).json({ success: false, messahe: "Flags array not provided" })
        
        var responses = []
        await db.client.connect()
        body.flags.forEach((async (f) => {
            if(await db.collections.fflags.findOne({ flag: f.flag })){
                await db.collections.fflags.updateOne({ flag: f.flag }, {"$set": {
                    value: f.value
                }})
                responses.push(`${f.flag} has been set to value ${f.value}`)
            } else {
                responses.push(`${f.flag} does not exist`)
            }
        }))
        await db.client.close()

        res.json({ success: true, responses })
    })
    return {
        method: "POST",
        route: "/bulkUpdate"   
    }
}