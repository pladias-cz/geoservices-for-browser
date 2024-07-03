import {CR, SK} from "./geo/known_polygons";

function getCountryPolygon() {
    const country = process.env.COUNTRY;
    if ("CR" === country) {
        return CR;
    }
    if ("SK" === country) {
        return SK;
    }
    return false;
}

module.exports = {getCountryPolygon};