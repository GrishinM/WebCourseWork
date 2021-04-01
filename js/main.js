let apiKey = "2caa25b33aca9b478fd0640e40deb621"
let geolocation = navigator.geolocation
let updateButton = document.getElementsByClassName("update-button")[0]
let currentPlaceContainer = document.getElementsByClassName("current-place-container")[0]
let favoritesContainer = document.getElementsByClassName("favorites-container")[0]
let form = document.getElementsByTagName("form")[0]
let currentPlaceTemplate = document.getElementById("current-place-container-template").content.childNodes[1]
let currentPlaceLoader = document.getElementById("current-place-loader").content.childNodes[1]
let placeTemplate = document.getElementById("place-container-template").content.childNodes[1]
let placeLoader = document.getElementById("place-loader").content.childNodes[1]
let placeFailedPlug = document.getElementById("place-failed").content.childNodes[1]

// localStorage.clear()

function degToCompass(num) {
    let val = Math.trunc((num / 22.5) + .5)
    let arr = ["С", "ССВ", "СВ", "ВСВ", "В", "ВЮВ", "ЮВ", "ЮЮВ", "Ю", "ЮЮЗ", "ЮЗ", "ЗЮЗ", "З", "ЗСЗ", "СЗ", "ССЗ"]
    return arr[(val % 16)]
}

async function findWeatherByCoords(lat, lon) {
    let query = `lat=${lat}&lon=${lon}`
    return await findWeather(query)
}

async function findWeatherByCity(cityName) {
    let query = `q=${cityName}`
    return await findWeather(query)
}

async function findWeatherById(id) {
    let query = `id=${id}`
    return await findWeather(query)
}

async function findWeather(query) {
    query = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric&lang=ru`
    let response = await fetch(query).catch(r => {
        throw new Error("Проблемы с сервером")
    })
    switch (response.status) {
        case 200:
            return response.json()
        case 404:
            throw new Error("Нет такого места")
        default:
            throw new Error("Проблемы с сервером")
    }
}

// function replace(weather) {
//     let clone = currentPlaceTemplate.content.childNodes[1].cloneNode(true)
//     clone.getElementsByTagName("h2")[0].innerText = weather.name
//     clone.getElementsByTagName("img")[0].src = `images/weather-icons/${weather.weather[0].icon}.png`
//     clone.getElementsByTagName("p")[0].innerText = `${weather.main.temp.toFixed(1)}°C`
//     fillTable(clone, weather)
//     currentPlaceContainer.replaceWith(clone)
//     currentPlaceContainer = clone
// }

function weatherToCurrentPlace(weather) {
    let clone = currentPlaceTemplate.cloneNode(true)
    clone.getElementsByTagName("h2")[0].innerText = weather.name
    clone.getElementsByTagName("img")[0].src = `images/weather-icons/${weather.weather[0].icon}.png`
    clone.getElementsByTagName("p")[0].innerText = `${weather.main.temp.toFixed(1)}°C`
    fillTable(clone, weather)
    return clone
}

function replace(element) {
    currentPlaceContainer.replaceWith(element)
    currentPlaceContainer = element
}

function updateGeolocation() {
    replace(currentPlaceLoader.cloneNode(true))
    geolocation.getCurrentPosition(async function (pos) {
        let coords = pos.coords
        try {
            replace(weatherToCurrentPlace(await findWeatherByCoords(coords.latitude, coords.longitude)))
        }
        catch (e) {
            alert(e.message)
        }
    }, async function () {
        alert("Невозможно определить геолокацию")
        try {
            replace(weatherToCurrentPlace(await findWeatherByCity("Sankt-Peterburg")))
        }
        catch (e) {
            alert(e.message)
        }
    })
}

function fillTable(element, weather) {
    let td = element.getElementsByTagName("td")
    td[0].innerText = `${degToCompass(weather.wind.deg)}, ${weather.wind.speed} м/с`
    td[1].innerText = `${weather.clouds.all}%`
    td[2].innerText = `${weather.main.pressure} гПа`
    td[3].innerText = `${weather.main.humidity}%`
    td[4].innerText = `[${weather.coord.lon}, ${weather.coord.lat}]`
}

function addFavoriteToContainer(weather, loader) {
    let clone = placeTemplate.cloneNode(true)
    clone.id = weather.id
    clone.getElementsByTagName("h3")[0].innerText = weather.name
    clone.getElementsByTagName("p")[0].innerText = `${weather.main.temp.toFixed(1)}°C`
    clone.getElementsByTagName("img")[0].src = `images/weather-icons/${weather.weather[0].icon}.png`
    clone.getElementsByTagName("button")[0].addEventListener("click", function () {
        clone.remove()
        localStorage.removeItem(clone.id)
    })
    fillTable(clone, weather)
    // favoritesContainer.append(clone)
    loader.replaceWith(clone)
}

async function addFavorite(cityName) {
    let loader = placeLoader.cloneNode(true)
    favoritesContainer.append(loader)
    let weather = null
    try {
        weather = await findWeatherByCity(cityName)
    } catch (e) {
        alert(e.message)
        loader.replaceWith(getFailedPlug())
        return
    }
    let id = weather.id
    if (localStorage.getItem(id) !== null) {
        alert("Это место уже в избранном")
        loader.remove()
        return
    }
    addFavoriteToContainer(weather, loader)
    localStorage.setItem(id, "")
    form.reset()
}

async function loadStorage(){
    for (let i = 0, len = localStorage.length; i < len; i++) {
        let id = localStorage.key(i)
        let loader = placeLoader.cloneNode(true)
        favoritesContainer.append(loader)
        let weather = null
        try {
            weather = await findWeatherById(id)
        }
        catch (e) {
            alert(e.message)
            // loader.getElementsByTagName("h3")[0].innerText = "Произошла ошибка"
            loader.replaceWith(getFailedPlug())
            break
        }
        addFavoriteToContainer(weather, loader)
    }
}

function getFailedPlug(){
    let plug = placeFailedPlug.cloneNode(true)
    plug.getElementsByTagName("button")[0].addEventListener("click", function () {
        plug.remove()
    })
    return plug
}

updateButton.addEventListener("click", updateGeolocation)
form.addEventListener("submit", async function (evt) {
    evt.preventDefault()
    await addFavorite(form.elements["cityName"].value)
})
updateGeolocation()
loadStorage()