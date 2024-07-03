import {defaults as defaultControls, Attribution, OverviewMap, Zoom, ZoomToExtent} from "ol/control";
import {getCountryPolygon} from "./config";

const controls = defaultControls().extend([
    //new OverviewMap(),
    new Attribution(),
    new Zoom(),
    new ZoomToExtent({extent: getCountryPolygon().extentOL()})
]);

export default controls;