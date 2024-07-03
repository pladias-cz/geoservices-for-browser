import * as httpHelper from "../common/http_helpers";

const paths = {
    public_wfs: process.env.PUBLIC_WFS,
    public_wms: process.env.PUBLIC_WMS,
    common_wfs: process.env.COMMON_WFS,
    common_wms: process.env.COMMON_WMS,
    protected_wms: httpHelper.getGeoBasePath() + '/geoserver/validation/wms',
    preprint_wfs: httpHelper.getGeoBasePath() + '/geoserver2/public/ows'
};

export default paths;