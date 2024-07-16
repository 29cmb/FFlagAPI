const db = require("./db.js")
const axios = require("axois")
module.exports = async(message) => {
    await db.client.connect()
    const webhooks = await db.collections.webhooks.find().toArray()
    webhooks.forEach(w =>{
        axios.post(w.url, {content: message})
    })
    await db.client.close()
} 