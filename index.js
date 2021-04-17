let apiKey = "2caa25b33aca9b478fd0640e40deb621"
const express = require("express")
let fetch = require("node-fetch")
const MongoClient = require("mongodb").MongoClient
const app = express()
app.use(express.static("."))
let port = 5000

let db
const mongoClient = new MongoClient("mongodb://localhost:27017/")
mongoClient.connect(function (err, client) {
    db = client.db("weather").collection("favorites")
})

async function findWeather(query) {
    query = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric&lang=ru`
    let response = await fetch(query).catch(r => {
        throw new Error(500)
    })
    if (!response.ok) {
        throw new Error(response.status)
    }
    return response.json()
}

async function findWeatherByCityName(cityName) {
    return await findWeather(`q=${cityName}`)
}

async function findWeatherByCityId(cityId) {
    return await findWeather(`id=${cityId}`)
}

async function findWeatherByCoords(lat, lon) {
    return await findWeather(`lat=${lat}&lon=${lon}`)
}

async function isCityInBase(cityName) {
    let weather = await findWeatherByCityName(cityName)
    let res = await db.find({cityId: weather.id}).toArray()
    return res.length > 0
}

async function addToFavorites(cityName) {
    let weather = await findWeatherByCityName(cityName)
    await db.insertOne({cityId: weather.id})
}

async function getFavoritesId() {
    return Array.from(await db.find().toArray()).map(x => x.cityId)
}

async function removeFromFavorites(cityId) {
    await db.deleteOne({cityId: cityId})
}

app.get("/", function (req, res) {
    res.redirect("index.html")
})

app.get("/weather", async function (req, res) {
    let q = req.query
    let weather
    try {
        if (q.cityId) {
            weather = await findWeatherByCityId(q.cityId)
        }
        if (q.cityName) {
            weather = await findWeatherByCityName(q.cityName)
        }
        if (q.coords) {
            weather = await findWeatherByCoords(q.coords.lat, q.coords.lon)
        }
    } catch (e) {
        res.sendStatus(e.message)
    }
    res.send(weather)
})

app.get("/favorites", async function (req, res) {
    res.send(await getFavoritesId())
})

app.post("/favorites", async function (req, res) {
    let cityName = req.query.cityName
    try {
        if (await isCityInBase(cityName)) {
            res.sendStatus(409)
            return
        }
    } catch (e) {
        res.sendStatus(e.message)
        return
    }
    await addToFavorites(cityName)
    res.sendStatus(200)
})

app.delete("/favorites", async function (req, res) {
    let cityId = Number(req.query.cityId)
    await removeFromFavorites(cityId)
})

app.listen(port)