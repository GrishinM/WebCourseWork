let apiKey = "2caa25b33aca9b478fd0640e40deb621"
let currentPlaceContainer = document.getElementsByClassName("current-place-container")[0]
let favoritesContainer = document.getElementsByClassName("favorites-container")[0]
let input = document.getElementsByTagName("input")[0]

function findWeatherByCoords(lat, lon) {
    let query = `lat=${lat}&lon=${lon}`
    return findWeather(query)
}

function findWeatherByCity(cityName) {
    let query = `q=${cityName}`
    return findWeather(query)
}

function findWeather(query) {
    query = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric&lang=ru`
    let xmlHttpRequest = new XMLHttpRequest()
    xmlHttpRequest.open("GET", query, false)
    xmlHttpRequest.send()
    if (xmlHttpRequest.status !== 200) {
        throw new Error()
    }
    return JSON.parse(xmlHttpRequest.responseText)
}

function replace(weather) {
    let newElement = weatherToBigHtml(weather)
    currentPlaceContainer.replaceWith(newElement)
    currentPlaceContainer = newElement
}

function updateGeolocation() {
    let geolocation = navigator.geolocation
    geolocation.getCurrentPosition(function (pos) {
        let coords = pos.coords
        replace(findWeatherByCoords(coords.latitude, coords.longitude))
    }, function () {
        replace(findWeatherByCity("Sankt-Peterburg"))
    })
}

function addFavoriteToContainer(cityName) {
    let weather = findWeatherByCity(cityName)
    let el = weatherToSmallHtml(weather)
    el.id = cityName
    favoritesContainer.append(el)
}

function addFavorite(cityName) {
    cityName = cityName.toLowerCase()
    if (localStorage.getItem(cityName) !== null) {
        alert("Это место уже в избранном")
        return
    }
    try {
        addFavoriteToContainer(cityName)
        localStorage.setItem(cityName, "")
        input.value = ""
    } catch (e) {
        alert("Нет такого места")
    }
}

updateGeolocation()
for (let i = 0, len = localStorage.length; i < len; i++) {
    let cityName = localStorage.key(i)
    addFavoriteToContainer(cityName)
}