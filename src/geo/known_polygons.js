import {transform} from "ol/proj";
import projection from "./projections";
import Geofunctions from "./geofunctions";

export const CR = {
    centroidWGS: [15.4, 49.85],
    centroidOL: function () {
        return transform(CR.centroidWGS, projection.WGS, projection.OL)
    },
    extentWGS: [14.9, 48.6, 16.1, 51.1],
    extentOL: function () {
        return Geofunctions.transformExtentWGS2OL(CR.extentWGS);
    },
    isInCzechRectangle: function (lon,lat) {
        return (lon > 11.9 && lon < 19 && lat > 48.40 && lat < 51.27)
    }
};

export const FSG = {
    centroidWGS: [13.62, 48.930],
    centroidOL: function () {
        return transform(FSG.centroidWGS, projection.WGS, projection.OL)
    },
    extentWGS: [13.0, 48.0, 15.1, 50.5],
    extentOL: function () {
        return Geofunctions.transformExtentWGS2OL(FSG.extentWGS);
    },
};

export const polygons = {
    sumava: {
        id: 1,
        centroidWGS: [13.8, 48.95],
        centroidOL: function () {
            return transform(this.centroidWGS, projection.WGS, projection.OL)
        }
    }
};