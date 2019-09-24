/**
 * TODO - replace JQuery with naja.js
 */

import * as httpHelper from "../common/http_helpers";
import paths from "../geo/geoserver";
import {bbox as defaultStrategy} from "ol/loadingstrategy";
import projection from "../geo/projections";
import {polygons} from "../geo/known_polygons";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import $ from 'jquery';
/**
 * TODO this is hacking value of Taxon-ID
 */
const taxon = 5;


const vectorSources = {
    squares: new VectorSource({
        format: new GeoJSON(),
        loader: function (extent, resolution, projection) {
            $.ajax({
                type: 'GET',
                url: paths.common_wfs,
                data: {
                    SERVICE: 'WFS',
                    VERSION: '1.0.0',
                    REQUEST: 'GetFeature',
                    TYPENAME: 'commonStyles:squares',
                    OUTPUTFORMAT: 'text/javascript',
                    FORMAT_OPTIONS: 'callback:PladiasMap.vectorCallbacks.loadSquares'
                },
                dataType: 'jsonp'
            });
        },
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    squaresNoCallback: new VectorSource({
        format: new GeoJSON(),
        loader: function (extent, resolution, projection) {
            $.ajax({
                type: 'GET',
                url: paths.common_wfs,
                data: {
                    SERVICE: 'WFS',
                    VERSION: '1.0.0',
                    REQUEST: 'GetFeature',
                    TYPENAME: 'commonStyles:squares',
                    OUTPUTFORMAT: 'application/json'
                },
                dataType: 'jsonp'
            });
        },
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    regions: new VectorSource({
        format: new GeoJSON(),
        loader: function (extent, resolution, projection) {
            $.ajax({
                type: 'GET',
                url: paths.common_wfs,
                data: {
                    SERVICE: 'WFS',
                    VERSION: '1.0.0',
                    REQUEST: 'GetFeature',
                    TYPENAME: 'commonStyles:regions',
                    OUTPUTFORMAT: 'text/javascript',
                    FORMAT_OPTIONS: 'callback:PladiasMap.vectorCallbacks.loadRegions',
                    VIEWPARAMS: 'ID:' + polygons.sumava.id
                },
                dataType: 'jsonp'
            });
        },
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    neurceny: new VectorLayer({
        format: new GeoJSON(),
        loader: function (extent, resolution, projection) {
            $.ajax({
                type: 'GET',
                url: paths.public_wfs,
                data: {
                    SERVICE: 'WFS',
                    VERSION: '1.0.0',
                    REQUEST: 'GetFeature',
                    TYPENAME: 'vektor:neurceny',
                    OUTPUTFORMAT: 'text/javascript',
                    FORMAT_OPTIONS: 'callback:PladiasMap.vectorCallbacks.loadNeurceny',
                    VIEWPARAMS: 'TAXON_ID:' + taxon
                },
                dataType: 'jsonp'
            });
        },
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    jisty: new VectorLayer({
        format: new GeoJSON(),
        loader: function (extent, resolution, projection) {
            $.ajax({
                type: 'GET',
                url: paths.public_wfs,
                data: {
                    SERVICE: 'WFS',
                    VERSION: '1.0.0',
                    REQUEST: 'GetFeature',
                    TYPENAME: 'vektor:jisty',
                    OUTPUTFORMAT: 'text/javascript',
                    FORMAT_OPTIONS: 'callback:PladiasMap.vectorCallbacks.loadJisty',
                    VIEWPARAMS: 'TAXON_ID:' + taxon
                },
                dataType: 'jsonp'
            });
        },
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintJisty: new VectorLayer({
        format: new GeoJSON(),
        url: httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_jisty' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintNejisty: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_nejisty' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintCommon: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_common' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintCommonRecent: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_common_recent' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintCommonZanik: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_common_zanik' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintHerb: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_herb' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintNeherb: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_neherb' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintPestovany: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_pestovany' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintPuvodni: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_puvodni' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintNepuvodni: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_nepuvodni' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintNeurceny: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_neurceny' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintRecent: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_recent' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),
    preprintZanik: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_zanik' +
            '&viewparams=TAXON_ID:' + taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: defaultStrategy,
        projection: projection.OL
    }),

};

export default vectorSources;