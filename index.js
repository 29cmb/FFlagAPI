const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
require("dotenv").config()
app.use(express.json())

app.use(express.static(path.join(__dirname, "views")));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${(process.env.PORT || 3000).toString()}`)
})

const apiPath = path.join(__dirname, "api")
const apiFiles = fs.readdirSync(apiPath).filter(file => file.endsWith('.js'))

for (const file of apiFiles) {
    const filePath = path.join(apiPath, file)
    const data = require(filePath)(app)
    if(data.method && data.route){
        console.log(`✅ | API route ${data.method} '${data.route}' has been setup successfully`)
    } else {
        console.log(`❌ | API route '${filePath}' did not return data.method or did not return data.route`)
    }
}

require("./modules/db.js").run()