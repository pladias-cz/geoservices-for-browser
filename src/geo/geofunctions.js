import {getTransform, transform, transformExtent} from "ol/proj";
import {applyTransform} from "ol/extent";
import projection from "./projections";

const Geofunctions = {
    transformExtentOL2WGS: function (extent) {
        return transformExtent(extent, projection.OL, projection.WGS).join(',');
    },
    transformExtentWGS2OL: function (extent) {
        return applyTransform(extent, getTransform(projection.WGS, projection.OL));
    },
    transformCoordsOL2WGS: function (coordinates) {
        return transform(coordinates, projection.OL.getCode(), projection.WGS.getCode());
    },
    transformCoordsWGS2OL: function (coordinates) {
        return transform(coordinates, projection.WGS.getCode(), projection.OL.getCode());
    },
    convertDMSFormat: function (coordinate, type) {
        let coords = [];

        let absCoordinate = Math.abs(coordinate)
        let coordinateDegrees = Math.floor(absCoordinate);

        let coordinateMinutes = (absCoordinate - coordinateDegrees) / (1 / 60);
        let tempCoordinateMinutes = coordinateMinutes;
        coordinateMinutes = Math.floor(coordinateMinutes);
        let coordinateSeconds = (tempCoordinateMinutes - coordinateMinutes) / (1 / 60);
        coordinateSeconds = Math.round(coordinateSeconds * 10);
        coordinateSeconds /= 10;

        if (coordinateDegrees < 10)
            coordinateDegrees = "0" + coordinateDegrees;

        if (coordinateMinutes < 10)
            coordinateMinutes = "0" + coordinateMinutes;

        if (coordinateSeconds < 10)
            coordinateSeconds = "0" + coordinateSeconds;

        coords[0] = coordinateDegrees;
        coords[1] = coordinateMinutes;
        coords[2] = coordinateSeconds;
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
    roundCoord: function (coord) {
        return Math.round(coord * 1000) / 1000;
    }
};

export default Geofunctions;