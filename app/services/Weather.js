import * as http from "tns-core-modules/http";
import { owmAppId } from "../config";
import * as moment from 'moment';
import 'moment/locale/es';

const baseUrl = "https://api.openweathermap.org/data/2.5";
const baseUrlCities = "https://apiciudades.000webhostapp.com";
const baseUrlCountries = "https://restcountries.eu/rest/v2";
const weatherIconsMap = require("../weather-icons-map");

export default {
    async getWeatherByGeolocation(loc) {
        let url =
        `${baseUrl}/weather?APPID=${owmAppId}&units=metric&lat=${loc.latitude}&lon=${loc.longitude}`;
        const response = await http.request({ url: url, method: "GET" });
        let weather = parseResponse(response);

        return weather;
    },
    
    async getWeatherById(owmId) {
        let url =
        `${baseUrl}/weather?APPID=${owmAppId}&units=metric&id=${owmId}`;
        const response = await http.request({ url: url, method: "GET" });
        let weather = parseResponse(response);

        return weather;
    },

    async findCities(city, country) {
        let url = `${baseUrlCities}/cities?city=${city}`;
        if(country) {
            url += `&country=${country}`;
        }
        const response = await http.request({ url: url, method: "GET" });
        return response.content.toJSON();
    },

    async getCountries() {
        let url = `${baseUrlCountries}/all?fields=name;alpha2Code`;
        const response = await http.request({ url: url, method: "GET" });
        return response.content.toJSON();
    }
}

function parseResponse(response) {
    let weatherResponse = {};
    
    let location = response.content.toJSON();
    weatherResponse.city = {
        owmId: location.id,
        name: location.name,
        country: location.sys.country,
        longitude: location.coord.lon,
        latitude: location.coord.lat
    };
    weatherResponse.summary = getSummary(location.weather[0].id);
    weatherResponse.icon = location.weather[0].icon;
    weatherResponse.unicodeIcon = getUnicodeIcon(location.weather[0].icon, location.weather[0].id);
    let weatherObj = JSON.stringify(location.main);
    let weather = JSON.parse(weatherObj);
    weatherResponse.currentTemperature = Math.round(weather.temp).toString() + "°";
    weatherResponse.minTemperature = Math.round(weather.temp_min).toString() + "°";
    weatherResponse.maxTemperature = Math.round(weather.temp_max).toString() + "°";
    weatherResponse.humidity = weather.humidity.toString();
    weatherResponse.pressure = weather.pressure.toString();
    let windObj = JSON.stringify(location.wind);
    let wind = JSON.parse(windObj);
    weatherResponse.windSpeed = Math.round(wind.speed * 3.6);

    // Seteo las fechas
    moment.locale("es");
    let date = moment.unix(location.dt).utc().utcOffset(location.timezone/60).format("dddd, D [de] MMMM");
    weatherResponse.date = date.charAt(0).toUpperCase() + date.slice(1);
    weatherResponse.time = moment.unix(location.dt).utc().utcOffset(location.timezone/60).format("HH:mm");
    weatherResponse.sunrise = moment.unix(location.sys.sunrise).utcOffset(location.timezone/60).format("HH:mm");
    weatherResponse.sunset = moment.unix(location.sys.sunset).utcOffset(location.timezone/60).format("HH:mm");
    weatherResponse.lastUpdate = moment().format("D [de] MMMM HH:mm");
    
    return weatherResponse;
}

// Devuelve el unicode que se usará para mostrar el ícono correspondiente
function getUnicodeIcon(icon, id) {
    let dayNight = (icon.charAt(2) == "d")? "day" : "night";
    let key = `wi_owm_${dayNight}_${id}`;
    return weatherIconsMap[key];
}

// Traducciones de los códigos devueltos por la API
function getSummary(id) {
    let summary;
    switch (true) {
        case id < 300:
            summary = "Tormenta eléctrica";
            break;
        case id < 400:
            summary = "Llovizna";
            break;
        case id < 600:
            summary = "Lluvia";
            break;
        case id < 700:
            summary = "Nieve";
            break;
        case id == 701:
            summary = "Neblina";
            break;
        case id == 711:
            summary = "Humo";
            break;
        case id == 721:
            summary = "Bruma";
            break;
        case id == 731:
            summary = "Polvo";
            break;
        case id == 741:
            summary = "Niebla";
            break;
        case id == 751:
            summary = "Arena";
            break;
        case id == 761:
            summary = "Polvo";
            break;
        case id == 762:
            summary = "Cenizas";
            break;
        case id == 771:
            summary = "Chubascos";
            break;
        case id == 781:
            summary = "Tornado";
            break;
        case id == 800:
            summary = "Despejado";
            break;
        case id == 801:
            summary = "Parcialmente nublado";
            break;
        case id < 900:
            summary = "Nublado";
            break;
        default:
            summary = "Desconocido";
            break;
    }
    return summary;
}