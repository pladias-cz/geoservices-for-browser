import {getTransform, transform, transformExtent} from "ol/proj";
import PladiasMap from "../index";
import {applyTransform} from "ol/extent";

const Geofunctions = {
    transformExtentOL2WGS: function (extent) {
        return transformExtent(extent, PladiasMap.projection.OL, PladiasMap.projection.WGS).join(',');
    },
    transformExtentWGS2OL: function (extent) {
        return applyTransform(extent, getTransform(PladiasMap.projection.WGS, PladiasMap.projection.OL));
    },
    transformCoordsOL2WGS: function (coordinates) {
        return transform(coordinates, PladiasMap.projection.OL.getCode(), PladiasMap.projection.WGS.getCode());
    },
    transformCoordsWGS2OL: function (coordinates) {
        return transform(coordinates, PladiasMap.projection.WGS.getCode(), PladiasMap.projection.OL.getCode());
    },
    convertDMSFormat: function (coordinate, type) {
        let coords = [];

        let abscoordinate = Math.abs(coordinate)
        let coordinatedegrees = Math.floor(abscoordinate);

        let coordinateminutes = (abscoordinate - coordinatedegrees) / (1 / 60);
        let tempcoordinateminutes = coordinateminutes;
        coordinateminutes = Math.floor(coordinateminutes);
        let coordinateseconds = (tempcoordinateminutes - coordinateminutes) / (1 / 60);
        coordinateseconds = Math.round(coordinateseconds * 10);
        coordinateseconds /= 10;

        if (coordinatedegrees < 10)
            coordinatedegrees = "0" + coordinatedegrees;

        if (coordinateminutes < 10)
            coordinateminutes = "0" + coordinateminutes;

        if (coordinateseconds < 10)
            coordinateseconds = "0" + coordinateseconds;

        coords[0] = coordinatedegrees;
        coords[1] = coordinateminutes;
        coords[2] = coordinateseconds;
        coords[3] = this.getHemi(coordinate, type);

        return coords[0] + "°" + coords[1] + "\'" + coords[2] + "\"" + coords[3];
    },
    getHemi: function (coordinate, type) {
        let coordinatehemi = "";
        if (type === 'LAT') {
            if (coordinate >= 0) {
                coordinatehemi = "N";
            } else {
                coordinatehemi = "S";
            }
        } else if (type === 'LON') {
            if (coordinate >= 0) {
                coordinatehemi = "E";
            } else {
                coordinatehemi = "W";
            }
        }

        return coordinatehemi;
    },
    computeKFMESquare: function (lon, lat) {
        //if (lon>12 && lon<19.1 && lat>48.53 && lat<51.07)
        let row = Math.round(559.5 - (10 * lat));
        let col = Math.round((6 * lon) - 34.5);
        return row + '' + col;
    },
};

export default Geofunctions;