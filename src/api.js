const {isCityInBase, getFavoritesId, addToFavorites, removeFromFavorites} = require("./db")
const {findWeatherByCityId, findWeatherByCoords, findWeatherByCityName} = require("./weather")

async function getWeather(req, res) {
    let query = req.query
    let weather
    try {
        if (query.cityId) {
            weather = await findWeatherByCityId(query.cityId)
        }
        if (query.cityName) {
            weather = await findWeatherByCityName(query.cityName)
        }
        if (query.coords) {
            weather = await findWeatherByCoords(query.coords.lat, query.coords.lon)
        }
    } catch (e) {
        res.sendStatus(e.message)
    }
    res.send(weather)
}

async function getFavorites(req, res) {
    try {
        let ids = await getFavoritesId()
        res.send(ids)
    } catch (e) {
        res.sendStatus(500)
    }
}

async function postFavorites(req, res) {
    let cityId = Number(req.query.cityId)
    try {
        if (await isCityInBase(cityId)) {
            res.sendStatus(409)
            return
        }
        await addToFavorites(cityId)
    } catch (e) {
        res.sendStatus(500)
        return
    }
    res.sendStatus(201)
}

async function deleteFavorites(req, res) {
    let cityId = Number(req.query.cityId)
    try {
        await removeFromFavorites(cityId)
        res.sendStatus(202)
    } catch (e) {
        res.sendStatus(500)
    }
}

module.exports = {
    getWeather: getWeather,
    getFavorites: getFavorites,
    postFavorites: postFavorites,
    deleteFavorites: deleteFavorites
}