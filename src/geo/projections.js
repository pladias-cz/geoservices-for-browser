import {get as getProjection} from "ol/proj";

const projection = {
    OL: getProjection('EPSG:3857'),
    WGS: getProjection('EPSG:4326')
};

export default projection
