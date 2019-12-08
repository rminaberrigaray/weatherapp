import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import { Couchbase } from "nativescript-couchbase-plugin";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Feedback } from "nativescript-feedback";
import { Color } from "tns-core-modules/color";

const feedback = new Feedback();

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        database: null,
        favorites: new ObservableArray()
    },
    mutations: {
        init(state, database) {
            state.database = database;
        },
        loadFavorites(state, favorites) {
            state.favorites = favorites;
        },
        saveFavorite(state, city) {
            state.favorites.push(city);
        },
        removeFavorite(state, city) {
            state.favorites = state.favorites.filter(c => c.owmId != city.owmId);
        }
    },
    actions: {
        init(context) {
            context.commit("init", new Couchbase("favorites-database"));
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
        }
    },
    getters: {
        favorites: state => {
            return state.favorites;
        },
        isFavorite: state => owmId => ( state.favorites.find(c => c.owmId === owmId) != null )
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