import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import { Couchbase } from "nativescript-couchbase-plugin";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as appSettings from "tns-core-modules/application-settings";
import { Feedback } from "nativescript-feedback";
import { Color } from "tns-core-modules/color";
import WeatherService from "../services/Weather";

const feedback = new Feedback();

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        database: null,
        favorites: new ObservableArray(),
        lastWeather: null,
        countries: []
    },
    mutations: {
        init(state, data) {
            state.database = data.database;
            state.lastWeather = data.lastWeather;
        },
        loadCountries(state, countries) {
            state.countries = countries;
        },
        loadFavorites(state, favorites) {
            state.favorites = favorites;
        },
        saveFavorite(state, city) {
            state.favorites.push(city);
        },
        removeFavorite(state, city) {
            state.favorites = state.favorites.filter(c => c.owmId != city.owmId);
        },
        updateLastWeather(state, weather) {
            state.lastWeather = weather;
        }
    },
    actions: {
        init(context) {
            // Busca en las ApplicationSettings el último clima que se mostró en el inicio
            let lastWeather = appSettings.getString("lastWeather");
            if (lastWeather) {
                lastWeather = JSON.parse(lastWeather);
            }

            // Mutation init con el ultimo clima y la bbdd de favoritos
            context.commit("init", {
                database: new Couchbase("favorites-database"),
                lastWeather: lastWeather
            });
        },
        async loadCountries(context) {
            let countries = await WeatherService.getCountries();
            context.commit("loadCountries", countries);
        },
        loadFavorites(context) {
            let favorites = context.state.database.query({
                select: []
            });
            context.commit("loadFavorites", favorites);
        },
        toggleFavorite(context, city) {
            let message = "";

            // Busco el favorito en la bd
            let result = searchFavorite(context.state.database, city);

            // Inserto o borro
            if (!result.length) {
                context.state.database.createDocument(city);
                context.commit("saveFavorite", city);
                message = "Se agregó a la lista de favoritos.";
            } else {
                context.state.database.deleteDocument(result[0].id);
                context.commit("removeFavorite", city);
                message = "Se eliminó de la lista de favoritos.";
            }

            // Muestro el mensaje correspondiente
            feedback.show({
                message: message,
                duration: 1500,
                backgroundColor: new Color("#f2f2f2"),
                messageColor: new Color("Black"),
                messageSize: 16
            });
        },
        updateLastWeather(context, weather) {
            appSettings.setString("lastWeather", JSON.stringify(weather));
            context.commit("updateLastWeather", weather);
        }
    },
    getters: {
        favorites: state => {
            return state.favorites;
        },
        lastWeather: state => {
            return state.lastWeather;
        },
        isFavorite: state => owmId => ( state.favorites.find(c => c.owmId === owmId) != null ),
        countryName: state => countryCode => {
            let country = state.countries.find(c => c.alpha2Code == countryCode);
            return country.name || '';
        }
    }
});

function searchFavorite(database, city) {
    return database.query({
        select: [],
        where: [
            {
                property: 'owmId',
                comparison: 'equalTo',
                value: city.owmId
            }
        ]
    });
}

Vue.prototype.$store = store;
export default store;
store.dispatch("init");
store.dispatch("loadCountries");
store.dispatch("loadLastWeather");