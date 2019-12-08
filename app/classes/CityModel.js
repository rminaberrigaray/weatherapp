import { TokenModel } from "nativescript-ui-autocomplete";

export class CityModel extends TokenModel {

    constructor(id, city, country, longitude, latitude) {
        super(city + ", " + country);

        this.owmId = id;
        this.city = city;
        this.country = country;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    toString() {
        return this.city + ", " + this.country;
    }
}