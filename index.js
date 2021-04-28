const express = require("express")
const {getWeather, getFavorites, postFavorites, deleteFavorites} = require("./src/api")

const app = express()
app.use(express.static("."))

// let db
// const mongoClient = new MongoClient(process.env.connectionString)
// mongoClient.connect(function (err, client) {
//     db = client.db("weather").collection("favorites")
// })
//
// async function isCityInBase(cityId) {
//     let res = await db.find({cityId: cityId}).toArray()
//     return res.length > 0
// }
//
// async function addToFavorites(cityId) {
//     await db.insertOne({cityId: cityId})
// }
//
// async function getFavoritesId() {
//     return Array.from(await db.find().toArray()).map(x => x.cityId)
// }
//
// async function removeFromFavorites(cityId) {
//     await db.deleteOne({cityId: cityId})
// }

app.get("/", function (req, res) {
    res.redirect("index.html")
})

app.get("/weather", getWeather
//     async function (req, res) {
//     let query = req.query
//     let weather
//     try {
//         if (query.cityId) {
//             weather = await findWeatherByCityId(query.cityId)
//         }
//         if (query.cityName) {
//             weather = await findWeatherByCityName(query.cityName)
//         }
//         if (query.coords) {
//             weather = await findWeatherByCoords(query.coords.lat, query.coords.lon)
//         }
//     } catch (e) {
//         res.sendStatus(e.message)
//     }
//     res.send(weather)
// }
)

app.route("/favorites")
    .get(getFavorites
    //     async function (req, res) {
    //     try {
    //         let ids = await getFavoritesId()
    //         res.send(ids)
    //     } catch (e) {
    //         res.sendStatus(500)
    //     }
    // }
    )
    .post(postFavorites
    //     async function (req, res) {
    //     let cityId = Number(req.query.cityId)
    //     try {
    //         if (await isCityInBase(cityId)) {
    //             res.sendStatus(409)
    //             return
    //         }
    //         await addToFavorites(cityId)
    //     } catch (e) {
    //         res.sendStatus(500)
    //         return
    //     }
    //     res.sendStatus(201)
    // }
    )
    .delete(deleteFavorites
    //     async function (req, res) {
    //     let cityId = Number(req.query.cityId)
    //     try {
    //         await removeFromFavorites(cityId)
    //         res.sendStatus(202)
    //     } catch (e) {
    //         res.sendStatus(500)
    //     }
    // }
    )

app.listen(process.env.port)