import {transform} from "ol/proj";
import projection from "./projections";
import Geofunctions from "./geofunctions";

export const CR = {
    centroidWGS: [15.4, 49.85],
    centroidOL: function () {
        return transform(this.centroidWGS, projection.WGS, projection.OL)
    },
    extentWGS: [14.9, 48.6, 16.1, 51.1],
    extentOL: function () {
        return Geofunctions.transformExtentWGS2OL(this.extentWGS);
    },
    /** @deprecated , use isPointInside */
    isInCzechRectangle: function (lon,lat) {
        return this.isPointInside (lon,lat)
    },
    isPointInside: function (lon,lat) {
        return (lon > 11.9 && lon < 19 && lat > 48.40 && lat < 51.27)
    }
};

export const SK = {
    centroidWGS: [19.7, 48.67],
    centroidOL: function () {
        return transform(this.centroidWGS, projection.WGS, projection.OL)
    },
    extentWGS: [16.8, 47.7, 22.6, 49.7],
    extentOL: function () {
        return Geofunctions.transformExtentWGS2OL(this.extentWGS);
    },
    isPointInside: function (lon,lat) {
        return (lon > 16.8 && lon < 22.6 && lat > 47.7 && lat < 49.7)
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

export const FVD = {
    centroidWGS: [14.37, 48.51],
    centroidOL: function () {
        return transform(FVD.centroidWGS, projection.WGS, projection.OL)
    },
    extentWGS: [13.6, 47.0, 15.5, 49.5],
    extentOL: function () {
        return Geofunctions.transformExtentWGS2OL(FVD.extentWGS);
    },
};

export const polygons = {
    sumava: {
        id: 1,
        centroidWGS: [13.8, 48.95],
        centroidOL: function () {
            return transform(this.centroidWGS, projection.WGS, projection.OL)
        }
    },
    fvd: {
        id: 4,
        centroidWGS: [14.62, 48.530],
        centroidOL: function () {
            return transform(this.centroidWGS, projection.WGS, projection.OL)
        }
    }
};