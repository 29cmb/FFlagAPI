const db = require("./db.js")
const axios = require("axios")
module.exports = async(message) => {
    const webhooks = await db.collections.webhooks.find().toArray()
    webhooks.forEach(w =>{
        axios.post(w.url, {content: message})
    })
} 