const fetch = require("node-fetch")

async function findWeather(query) {
    query = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${process.env.apiKey}&units=metric&lang=ru`
    let res = await fetch(query).catch(r => {
        throw new Error("500")
    })
    if (!res.ok) {
        throw new Error(res.status)
    }
    return res.json()
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

module.exports = {
    findWeatherByCityId: findWeatherByCityId,
    findWeatherByCityName: findWeatherByCityName,
    findWeatherByCoords: findWeatherByCoords
}