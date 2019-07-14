import * as httpHelper from "../common/http_helpers";

const geoserver = {
    public_wfs: 'https://geoserver.ibot.cas.cz/pladias_wfs/ows',
    public_wms: 'https://geoserver.ibot.cas.cz/pladias/ows',
    common_wfs: 'https://geoserver.ibot.cas.cz/common_wfs/ows',
    common_wms: 'https://geoserver.ibot.cas.cz/common/ows',
    protected_wms: httpHelper.getGeoBasePath() + '/geoserver/validation/wms',
    preprint_wfs: httpHelper.getAppBasePath() + '/geoserver2/public/ows'
};

export default geoserver;