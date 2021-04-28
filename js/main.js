let geolocation = navigator.geolocation;
let updateButton = document.getElementsByClassName("update-button")[0];
let currentPlaceContainer = document.getElementsByClassName("current-place-container")[0];
let favoritesContainer = document.getElementsByClassName("favorites-container")[0];
let form = document.getElementsByTagName("form")[0];
let currentPlaceTemplate = document.getElementById("current-place-container-template").content.childNodes[1];
let currentPlaceLoader = document.getElementById("current-place-loader").content.childNodes[1];
let currentPlaceFailed = document.getElementById("current-place-failed").content.childNodes[1];
let placeTemplate = document.getElementById("place-container-template").content.childNodes[1];
let placeLoader = document.getElementById("place-loader").content.childNodes[1];

function degToCompass(num) {
    let val = Math.trunc((num / 22.5) + .5);
    let arr = ["С", "ССВ", "СВ", "ВСВ", "В", "ВЮВ", "ЮВ", "ЮЮВ", "Ю", "ЮЮЗ", "ЮЗ", "ЗЮЗ", "З", "ЗСЗ", "СЗ", "ССЗ"];
    return arr[(val % 16)];
}

async function findWeather(query) {
    query = `/weather?${query}`;
    let res = await fetch(query).catch(r => {
        throw new Error("Проблема с интернет-соединением");
    });
    if (!res.ok) {
        switch (res.status) {
            case 404:
                throw new Error("Нет такого места");
            default:
                throw new Error("Проблемы с сервером");
        }
    }
    return res.json();
}

async function findWeatherByCityName(cityName) {
    return await findWeather(`cityName=${cityName}`);
}

async function findWeatherByCityId(cityId) {
    return await findWeather(`cityId=${cityId}`);
}

async function findWeatherByCoords(lat, lon) {
    return await findWeather(`coords[lat]=${lat}&coords[lon]=${lon}`);
}

function weatherToCurrentPlace(weather) {
    let clone = currentPlaceTemplate.cloneNode(true);
    clone.getElementsByTagName("h2")[0].innerText = weather.name;
    clone.getElementsByTagName("img")[0].src = `images/weather-icons/${weather.weather[0].icon}.png`;
    clone.getElementsByTagName("p")[0].innerText = `${weather.main.temp.toFixed(1)}°C`;
    fillTable(clone, weather);
    return clone;
}

function replace(element) {
    currentPlaceContainer.replaceWith(element);
    currentPlaceContainer = element;
}

function updateGeolocation() {
    replace(currentPlaceLoader.cloneNode(true));
    geolocation.getCurrentPosition(async function (pos) {
        let coords = pos.coords;
        try {
            replace(weatherToCurrentPlace(await findWeatherByCoords(coords.latitude, coords.longitude)));
        } catch (e) {
            replace(currentPlaceFailed.cloneNode(true));
        }
    }, async function () {
        alert("Невозможно определить геолокацию");
        try {
            replace(weatherToCurrentPlace(await findWeatherByCityName("Sankt-Peterburg")));
        } catch (e) {
            replace(currentPlaceFailed.cloneNode(true));
        }
    });
}

function fillTable(element, weather) {
    let td = element.getElementsByTagName("td");
    td[0].innerText = `${degToCompass(weather.wind.deg)}, ${weather.wind.speed} м/с`;
    td[1].innerText = `${weather.clouds.all}%`;
    td[2].innerText = `${weather.main.pressure} гПа`;
    td[3].innerText = `${weather.main.humidity}%`;
    td[4].innerText = `[${weather.coord.lon}, ${weather.coord.lat}]`;
}

function addFavoriteToContainer(weather, loader) {
    let clone = placeTemplate.cloneNode(true);
    clone.id = weather.id;
    clone.getElementsByTagName("h3")[0].innerText = weather.name;
    clone.getElementsByTagName("p")[0].innerText = `${weather.main.temp.toFixed(1)}°C`;
    clone.getElementsByTagName("img")[0].src = `images/weather-icons/${weather.weather[0].icon}.png`;
    clone.getElementsByTagName("button")[0].addEventListener("click", async function () {
        let res = await fetch(`/favorites?cityId=${clone.id}`, {method: "DELETE"});
        if (!res.ok) {
            alert("Проблемы с сервером");
            return;
        }
        clone.remove();
    });
    fillTable(clone, weather);
    loader.replaceWith(clone);
}

async function addFavorite(cityName) {
    let loader = placeLoader.cloneNode(true);
    favoritesContainer.append(loader);
    let weather;
    try {
        weather = await findWeatherByCityName(cityName);
    } catch (e) {
        alert(e.message);
        loader.remove();
        return;
    }
    let res = await fetch(`/favorites?cityId=${weather.id}`, {method: "POST"});
    if (!res.ok) {
        switch (res.status) {
            case 409:
                alert("Это место уже в избранном");
                break;
            default:
                alert("Проблемы с сервером");
                break;
        }
        loader.remove();
        return;
    }
    addFavoriteToContainer(weather, loader);
    form.reset();
}

async function loadFavorites() {
    let res = await fetch("/favorites");
    if (!res.ok) {
        alert("Проблемы с сервером");
    }
    let ids = Array.from(await res.json());
    for (let id of ids) {
        let loader = placeLoader.cloneNode(true);
        favoritesContainer.append(loader);
        let weather;
        try {
            weather = await findWeatherByCityId(id);
        } catch (e) {
            alert(e.message);
            loader.remove();
            break;
        }
        addFavoriteToContainer(weather, loader);
    }
}

updateButton.addEventListener("click", updateGeolocation);
form.addEventListener("submit", async function (evt) {
    evt.preventDefault();
    await addFavorite(form.elements["cityName"].value);
});
updateGeolocation();
loadFavorites();