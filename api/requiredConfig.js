module.exports = (app) => {
    app.get("/api/frontends/config", (req, res) => {
        res.json({success: true, data: require("../config/robloxRequiredConfigs.json")})
    })
    return {
        method: "GET",
        route: "/api/frontends/config"
    }
}