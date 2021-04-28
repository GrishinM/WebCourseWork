const MongoClient = require("mongodb").MongoClient

let db
const mongoClient = new MongoClient(process.env.connectionString)
mongoClient.connect(function (err, client) {
    db = client.db("weather").collection("favorites")
})

async function isCityInBase(cityId) {
    let res = await db.find({cityId: cityId}).toArray()
    return res.length > 0
}

async function getFavoritesId() {
    return Array.from(await db.find().toArray()).map(x => x.cityId)
}

async function addToFavorites(cityId) {
    await db.insertOne({cityId: cityId})
}

async function removeFromFavorites(cityId) {
    await db.deleteOne({cityId: cityId})
}

module.exports = {
    isCityInBase: isCityInBase,
    getFavoritesId: getFavoritesId,
    addToFavorites: addToFavorites,
    removeFromFavorites: removeFromFavorites
}