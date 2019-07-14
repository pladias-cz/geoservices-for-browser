import {transform} from "ol/proj";
import PladiasMap from "../index";
import {extentServer2Client} from "./geofunctions";

export const CR = {
    centroidWGS: [15.4, 49.85],
    centroidOL: function () {
        return transform(CR.centroidWGS, PladiasMap.projection.WGS, PladiasMap.projection.OL)
    },
    extentWGS: [14.9, 48.6, 16.1, 51.1],
    extentOL: function () {
        return extentServer2Client(CR.extentWGS);
    },
};

export const polygons = {
    sumava: {
        id: 1,
        centroidWGS: [13.8, 48.95],
        centroidOL: function () {
            return transform(polygons.sumava.centroidWGS, PladiasMap.projection.WGS, PladiasMap.projection.OL)
        }
    }
};