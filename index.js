const express = require("express");
const {getWeather, getFavorites, postFavorites, deleteFavorites} = require("./src/api");

const app = express();
app.use(express.static("."));

app.get("/", function (req, res) {
    res.redirect("index.html");
});

app.get("/weather", getWeather);

app.route("/favorites")
    .get(getFavorites)
    .post(postFavorites)
    .delete(deleteFavorites);

app.listen(process.env.port);