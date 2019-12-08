import { Couchbase } from "nativescript-couchbase-plugin";
const database = new Couchbase("favorites-database");

export default {
    getFavorites() {
        return database.query({
            select: [],
            order: [{ property: "name", direction: "asc" }]
        });
    },

    addFavorite(city) {
        let result = database.query({
            select: [],
            where: [
                {
                    property: 'id',
                    comparison: 'equalTo',
                    value: city.id
                }
            ]
        });
        if(!result.length) {
            let documentId = database.createDocument(city);
            return documentId;
        }
        return null;
    }
}