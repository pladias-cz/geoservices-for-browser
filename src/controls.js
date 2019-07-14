import {defaults as defaultControls} from "ol/control/util";
import {OverviewMap} from "ol/control";

const controls = defaultControls().extend([
    new OverviewMap()
]);

// defaultControls = {
//     withExtent: [
//         new ol.control.Attribution(),
//         new ol.control.Zoom(),
//         new ol.control.ZoomToExtent({extent: PladiasMap.extent.rawCR()}),
//     ]
// };

export default controls;