function degToCompass(num) {
    let val = Math.trunc((num / 22.5) + .5)
    let arr = ["С", "ССВ", "СВ", "ВСВ", "В", "ВЮВ", "ЮВ", "ЮЮВ", "Ю", "ЮЮЗ", "ЮЗ", "ЗЮЗ", "З", "ЗСЗ", "СЗ", "ССЗ"]
    return arr[(val % 16)]
}

function weatherToTable(weather) {
    let th1 = document.createElement("th")
    th1.innerText = "Ветер"

    let td1 = document.createElement("td")
    td1.innerText = `${degToCompass(weather.wind.deg)}, ${weather.wind.speed} м/с`

    let wind = document.createElement("tr")
    wind.append(th1, td1)

    let th2 = document.createElement("th")
    th2.innerText = "Облачность"

    let td2 = document.createElement("td")
    td2.innerText = `${weather.clouds.all}%`

    let clouds = document.createElement("tr")
    clouds.append(th2, td2)

    let th3 = document.createElement("th")
    th3.innerText = "Давление"

    let td3 = document.createElement("td")
    td3.innerText = `${weather.main.pressure} гПа`

    let pressure = document.createElement("tr")
    pressure.append(th3, td3)

    let th4 = document.createElement("th")
    th4.innerText = "Влажность"

    let td4 = document.createElement("td")
    td4.innerText = `${weather.main.humidity}%`

    let humidity = document.createElement("tr")
    humidity.append(th4, td4)

    let th5 = document.createElement("th")
    th5.innerText = "Координаты"

    let td5 = document.createElement("td")
    td5.innerText = `[${weather.coord.lon}, ${weather.coord.lat}]`

    let coords = document.createElement("tr")
    coords.append(th5, td5)

    let table = document.createElement("table")
    table.append(wind, clouds, pressure, humidity, coords)

    return table
}

function weatherToBigHtml(weather) {
    let h2 = document.createElement("h2")
    h2.innerText = weather.name

    let weatherIcon = document.createElement("img")
    weatherIcon.classList.add("current-place-weather-icon")
    weatherIcon.src = `images/weather-icons/${weather.weather[0].icon}.png`

    let p = document.createElement("p")
    p.classList.add("current-place-temperature")
    p.innerText = `${weather.main.temp.toFixed(1)}°C`

    let div1 = document.createElement("div")
    div1.append(weatherIcon, p)

    let div2 = document.createElement("div")
    div2.classList.add("current-place-main-info")
    div2.append(h2, div1)

    let table = weatherToTable(weather)
    table.classList.add("current-place-table")

    let div3 = document.createElement("div")
    div3.classList.add("current-place-container", "center")
    div3.append(div2, table)

    return div3
}

function weatherToSmallHtml(weather) {
    let h3 = document.createElement("h3")
    h3.classList.add("place-name")
    h3.innerText = weather.name

    let p = document.createElement("p")
    p.classList.add("place-temperature")
    p.innerText = `${weather.main.temp.toFixed(1)}°C`

    let weatherIcon = document.createElement("img")
    weatherIcon.classList.add("place-weather-icon")
    weatherIcon.src = `images/weather-icons/${weather.weather[0].icon}.png`

    let div1 = document.createElement("div")
    div1.classList.add("place-main-info")
    div1.append(h3, p, weatherIcon)

    let closeImg = document.createElement("img")
    closeImg.classList.add("remove-button")
    closeImg.src = "images/buttons/remove-button.png"

    let closeButton = document.createElement("button")
    closeButton.addEventListener("click", function () {
        li.remove()
        localStorage.removeItem(li.id)
    })
    closeButton.append(closeImg)

    let div2 = document.createElement("div")
    div2.classList.add("place-control")
    div2.append(div1, closeButton)

    let table = weatherToTable(weather)

    let li = document.createElement("li")
    li.classList.add("place-container")
    li.append(div2, table)

    return li
}