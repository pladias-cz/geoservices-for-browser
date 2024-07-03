'use strict';
import projection from "./geo/projections";
import Geofunctions from "./geo/geofunctions";
import {getCountryPolygon} from "./config";

export class PladiasPoint {
    constructor(coordinates) {
        let transformed_coordinates = Geofunctions.transformCoordsOL2WGS(coordinates);
        this.coords = {client: {}, server: {}, DMS: {}};
        this.coords.client.lat = coordinates[1];
        this.coords.client.lon = coordinates[0];
        this.coords.server.lat = transformed_coordinates[1];
        this.coords.server.lon = transformed_coordinates[0];

        this.grid = {row: {}, col: {}, square: {}, quad: {}};
        this.grid.row = Math.round(559.5 - (10 * this.coords.server.lat));
        this.grid.col = Math.round((6 * this.coords.server.lon) - 34.5);
        this.grid.square = this.grid.row + '' + this.grid.col;
        let DMS = Geofunctions.convertDMSFormat(this.coords.server.lat, "LAT");
        DMS += " " + Geofunctions.convertDMSFormat(this.coords.server.lon, "LON");
        this.coords.DMS = DMS;
    }

    getLon() {
        return this.coords.server.lon
    }

    getLat() {
        return this.coords.server.lat
    }

    isInCzechRectangle() {
        return getCountryPolygon().isPointInside(this.getLon(), this.getLat())
    }

    getInfoLong() {
        return ' <b>' + this.grid.square + '</b> | ' +
            projection.WGS.getCode() + ' <b>' +
            Geofunctions.roundCoord(this.coords.server.lat) + ',' +
            Geofunctions.roundCoord(this.coords.server.lon) + '</b> | ' + this.coords.DMS;
    }

    getInfoMedium() {
        return projection.WGS.getCode() + ' <b>' +
            Geofunctions.roundCoord(this.coords.server.lat) + ',' +
            Geofunctions.roundCoord(this.coords.server.lon) + '</b> | ' + this.coords.DMS;
    }
}