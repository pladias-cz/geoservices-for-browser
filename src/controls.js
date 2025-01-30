import {defaults as defaultControls, Attribution, Zoom, ZoomToExtent, ScaleLine, OverviewMap} from "ol/control";
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import getCountryPolygon from "./config";

const controls = defaultControls().extend([
    //new OverviewMap(),
    new Attribution(),
    new Zoom(),
    new ZoomToExtent({extent: getCountryPolygon().extentOL()})
]);

const scaleControl = new ScaleLine({
    units: 'metric',
    bar: true,
    steps: 4,
    text: false,
    minWidth: 140,
});

export const controlsWithScale = defaultControls().extend([
    scaleControl,
    new Attribution(),
    new Zoom(),
    new ZoomToExtent({extent: getCountryPolygon().extentOL()})
]);

const overviewMapControl = new OverviewMap({
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
    ],
    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false,
    ratio: 1,
    className: 'ol-overviewmap ol-custom-overview'
});

export const controlsWithScaleOverview = defaultControls().extend([
    overviewMapControl,
    scaleControl,
    new Attribution(),
    new Zoom(),
    new ZoomToExtent({extent: getCountryPolygon().extentOL()})
]);



export default controls;
