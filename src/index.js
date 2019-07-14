import * as httpHelper from './common/http_helpers';
import {common as PladiasStyles, preprint as PladiasPreprintStyles} from './style/styles';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js';
import Circle from 'ol/geom/Circle';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {transform, transformExtent, METERS_PER_UNIT} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSMSource from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import * as loadingStrategy from 'ol/loadingstrategy';
import $ from 'jquery';

const PladiasMap = {};

PladiasMap.functions = {
    drawCircleInMeter: function (map, radius) {
        let circleRadius = (radius / METERS_PER_UNIT.m) * 2;
        let center = map.getView().getCenter();

        let circle = new Circle(center, circleRadius);
        let circleFeature = new Feature(circle);

        // Source and vector layer
        const vectorSource = new VectorSource({
            projection: PladiasMap.projection.WGS.getCode()
        });
        vectorSource.addFeature(circleFeature);
        const vectorLayer = new VectorLayer({
            name: "Polohová přesnost záznamu (coords buffer)",
            id: 'coordspreci',
            source: vectorSource
        });

        map.addLayer(vectorLayer);
    },
    getLayer: function (name, visibility) {
        //  console.log('vyžádána vrstva '+name+' s viditelnsotí '+visibility);
        return PladiasMap.layers[name](visibility);
    },
    getLayerWithRadius: function (name, visibility, radius) {
        //  console.log('vyžádána vrstva '+name+' s viditelnsotí '+visibility);
        return PladiasMap.layersWithRadius[name](visibility, radius);
    },
    getPreprintLayer: function (name, color, radius) {
        return PladiasMap.preprintLayers[name](color, radius);
    },
    getLayerByTaxon: function (name, visibility, taxon) {
        //console.log('vyžádána vrstva '+name+' s viditelnsotí '+visibility + 'k taxonu ' + taxon);
        return PladiasMap.layersByTaxon[name](visibility, taxon);
    },
    getLayerByTaxonWithRadius: function (name, visibility, taxon, radius) {
        return PladiasMap.layersWithRadius[name](visibility, taxon, radius);
    },
    getLayerByProject: function (project, visibility, taxon) {
        return PladiasMap.layersByProject(visibility, project, taxon);
    },
    highlightSquare: function (map) {
        //vector square handling
        let collection = new Collection();
        const featureOverlay = new VectorLayer({
            map: map,
            source: new VectorSource({
                features: collection,
                useSpatialIndex: false // optional, might improve performance
            }),
            style: function (feature, resolution) {
                let text = resolution < 5000 ? feature.get('name') : '';
                if (!highlightStyleCache[text]) {
                    highlightStyleCache[text] = [new Style({
                        stroke: new Stroke({
                            color: '#f00',
                            width: 1
                        }),
                        text: new TextStyle({
                            font: '12px Calibri,sans-serif',
                            text: text,
                            fill: new Fill({
                                color: '#000'
                            }),
                            stroke: new Stroke({
                                color: '#f00',
                                width: 3
                            })
                        })
                    })];
                }
                return highlightStyleCache[text];
            },
            updateWhileAnimating: true, // optional, for instant visual feedback
            updateWhileInteracting: true // optional, for instant visual feedback
        });

        let highlight;

        const displayFeatureInfo = function (pixel) {

            let feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                return feature;
            });

            let info = document.getElementById('square-hover');
            if (feature) {
                info.innerHTML = 'pole ' + feature.get('id');//feature.getId() + ': ' + feature.get('id');
            } else {
                info.innerHTML = '&nbsp;';
            }
            if (feature !== highlight) {
                if (highlight) {
                    featureOverlay.getSource().removeFeature(highlight);
                }
                if (feature) {
                    featureOverlay.getSource().addFeature(feature);
                }
                highlight = feature;
            }

        };
        $(map.getViewport()).on('mousemove', function (evt) {
            let pixel = map.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel);
        });

    },
    fit2card: function (mapElement) {
        mapElement.height((mapElement.closest('.resizeable').find('.card-block').height()) - 5);
    },
    roundCoord: function (coord) {
        return Math.round(coord * 1000) / 1000;
    }
};

PladiasMap.layers = {
    osm: function (visibility) {
        return new TileLayer({
            title: 'Základní',
            name: 'Základní',
            id: 'base_OSM',
            type: 'base',
            visible: visibility,
            source: new OSMSource()
        });
    },
    zm25: function (visibility) {
        return new TileLayer({
            title: 'ZM 25',
            name: 'ZM 25',
            id: 'base_zm25',
            type: 'base',
            minResolution: 0,
            maxResolution: 12,
            visible: visibility,
            source: new TileWMS({
                url: 'http://geoportal.cuzk.cz/WMS_ZM25_PUB/service.svc/get',
                params: {'LAYERS': 'GR_ZM25'}
            })
        })
    },
    quads: function (visibility) {
        return new TileLayer({
            name: "Kvadranty",
            id: 'technical_quads',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.common_wms,
                params: {'LAYERS': 'common:quadrants', 'TILED': true},
                serverType: 'geoserver'
            })
        })
    },
    phytochor: function (visibility) {
        return new TileLayer({
            name: "Fytochoriony",
            id: 'technical_phytochor',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.common_wms,
                params: {'LAYERS': 'common:phytochorions', 'TILED': true},
                serverType: 'geoserver'
            })
        })
    },
    squares: function (visibility) {
        return new TileLayer({
            name: 'Čtvercová síť',
            id: 'technical_squares',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.common_wms,
                // url: geoBasePath + '/geoserver/validation/wms',
                params: {'LAYERS': 'common:squares', 'TILED': true},
                serverType: 'geoserver'
            })
        });
    },
    squaresVector: function (visibility) {
        return new VectorLayer({
            name: 'Čtvercová síť',
            id: 'technical_squares',
            visible: visibility,
            source: PladiasMap.vectorSources.squares,
            style: PladiasMap.styles.squares
        });

    },
    regions: function (visibility) {
        return new TileLayer({
            name: 'Regiony',
            id: 'technical_regions',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.common_wms,
                params: {'LAYERS': 'common:regions', 'TILED': true,'viewparams': 'ID:' + PladiasMap.constants.sumava},
                serverType: 'geoserver'
            })
        });

    },
    regionsVector: function (visibility) {
        return new VectorLayer({
            name: 'Regiony',
            id: 'technical_regions',
            visible: visibility,
            source: PladiasMap.vectorSources.regions,
            style: PladiasMap.styles.regions
        });

    },
};

PladiasMap.layersWithRadius = {
    neurcenyVector: function (visibility, radius) {
        return new VectorLayer({
            name: 'Šedé záznamy',
            id: 'uknown_validity_status',
            visible: visibility,
            source: PladiasMap.vectorSources.neurceny,
            style: PladiasMap.styles.getStyle('neurceny', radius)
        });
    },
    jistyVector: function (visibility, radius) {
        return new VectorLayer({
            name: 'Zelené záznamy',
            id: 'Accepted validity_status',
            visible: visibility,
            source: PladiasMap.vectorSources.jisty,
            style: PladiasMap.styles.getStyle('jisty', radius)
        });
    },
};

PladiasMap.preprintLayers = {
    preprintJisty: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintJisty,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintNejisty: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintNejisty,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintCommon: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintCommon,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintCommonRecent: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintCommonRecent,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintCommonZanik: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintCommonZanik,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintHerb: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintHerb,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintNeherb: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintNeherb,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintPestovany: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintPestovany,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintPuvodni: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintPuvodni,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintNepuvodni: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintNepuvodni,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintNeurceny: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintNeurceny,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintRecent: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintRecent,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
    preprintZanik: function (color, radius) {
        return new VectorLayer({
            source: PladiasMap.vectorSources.preprintZanik,
            style: PladiasMap.preprintStyles.getStyle(color, radius)
        });
    },
};

PladiasMap.vectorSources = {
    squares: new VectorSource({
        format: new GeoJSON(),
        loader: function (extent, resolution, projection) {
            $.ajax({
                type: 'GET',
                url: PladiasMap.geoserver.common_wfs,
                data: {
                    SERVICE: 'WFS',
                    VERSION: '1.0.0',
                    REQUEST: 'GetFeature',
                    TYPENAME: 'common:squares',
                    OUTPUTFORMAT: 'text/javascript',
                    FORMAT_OPTIONS: 'callback:PladiasMap.vectorCallbacks.loadSquares'
                },
                dataType: 'jsonp'
            });
        },
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    regions: new VectorSource({
        format: new GeoJSON(),
        loader: function (extent, resolution, projection) {
            $.ajax({
                type: 'GET',
                url: PladiasMap.geoserver.common_wfs,
                data: {
                    SERVICE: 'WFS',
                    VERSION: '1.0.0',
                    REQUEST: 'GetFeature',
                    TYPENAME: 'common:regions',
                    OUTPUTFORMAT: 'text/javascript',
                    FORMAT_OPTIONS: 'callback:PladiasMap.vectorCallbacks.loadRegions',
                    VIEWPARAMS: 'ID:' + PladiasMap.constants.sumava
                },
                dataType: 'jsonp'
            });
        },
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    neurceny: new VectorLayer({
        format: new GeoJSON(),
        loader: function (extent, resolution, projection) {
            $.ajax({
                type: 'GET',
                url: PladiasMap.geoserver.public_wfs,
                data: {
                    SERVICE: 'WFS',
                    VERSION: '1.0.0',
                    REQUEST: 'GetFeature',
                    TYPENAME: 'vektor:neurceny',
                    OUTPUTFORMAT: 'text/javascript',
                    FORMAT_OPTIONS: 'callback:PladiasMap.vectorCallbacks.loadNeurceny',
                    VIEWPARAMS: 'TAXON_ID:' + PladiasMap.taxon
                },
                dataType: 'jsonp'
            });
        },
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    jisty: new VectorLayer({
        format: new GeoJSON(),
        loader: function (extent, resolution, projection) {
            $.ajax({
                type: 'GET',
                url: PladiasMap.geoserver.public_wfs,
                data: {
                    SERVICE: 'WFS',
                    VERSION: '1.0.0',
                    REQUEST: 'GetFeature',
                    TYPENAME: 'vektor:jisty',
                    OUTPUTFORMAT: 'text/javascript',
                    FORMAT_OPTIONS: 'callback:PladiasMap.vectorCallbacks.loadJisty',
                    VIEWPARAMS: 'TAXON_ID:' + PladiasMap.taxon
                },
                dataType: 'jsonp'
            });
        },
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintJisty: new VectorLayer({
        format: new GeoJSON(),
        url: httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_jisty' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintNejisty: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_nejisty' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintCommon: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_common' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintCommonRecent: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_common_recent' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintCommonZanik: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_common_zanik' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintHerb: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_herb' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintNeherb: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_neherb' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintPestovany: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_pestovany' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintPuvodni: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_puvodni' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintNepuvodni: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_nepuvodni' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintNeurceny: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_neurceny' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintRecent: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_recent' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),
    preprintZanik: new VectorLayer({
        format: new GeoJSON(),
        url:httpHelper.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_zanik' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.OL
    }),

};

PladiasMap.vectorCallbacks = {
    loadSquares: function (response) {
        var format = new GeoJSON();
        PladiasMap.vectorSources.squares.addFeatures(format.readFeatures(response, {featureProjection: PladiasMap.projection.OL}));
    },
    loadRegions: function (response) {
        var format = new GeoJSON();
        PladiasMap.vectorSources.regions.addFeatures(format.readFeatures(response, {featureProjection: PladiasMap.projection.OL}));
    },
    loadNeurceny: function (response) {
        var format = new GeoJSON();
        PladiasMap.vectorSources.neurceny.addFeatures(format.readFeatures(response, {featureProjection: PladiasMap.projection.OL}));
    },
    loadJisty: function (response) {
        var format = new GeoJSON();
        PladiasMap.vectorSources.jisty.addFeatures(format.readFeatures(response, {featureProjection: PladiasMap.projection.OL}));
    },
};

PladiasMap.layersByTaxon = {
    semafor: function (visibility, taxonId) {
        return new TileLayer({
            name: "Záznamy přivázané ke kvadrantu",
            id: 'technical_semafor',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.protected_wms,
                params: {
                    'LAYERS': 'validation:taxon_per_quadrant',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    semaforPublic: function (visibility, taxonId) {
        return new TileLayer({
            name: "Záznamy přivázané ke kvadrantu",
            id: 'technical_semafor',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.public_wfs,
                params: {'LAYERS': 'vektor:semafor', 'TILED': true, 'viewparams': 'TAXON_ID:' + taxonId},
                serverType: 'geoserver'
            })
        });
    },
    common_count_1: function (visibility, taxonId) {
        return new TileLayer({
            name: "Kvadranty s min. 1 nerevidovaným záznamem",
            id: 'technical_common_count_1',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.protected_wms,
                params: {
                    'LAYERS': 'validation:taxon_quadrant_count_1',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    common_count_2: function (visibility, taxonId) {
        return new TileLayer({
            name: "Kvadranty s min. 2 nerevidovanými záznamy",
            id: 'technical_common_count_2',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.protected_wms,
                params: {
                    'LAYERS': 'validation:taxon_quadrant_count_2',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    common_count_3: function (visibility, taxonId) {
        return new TileLayer({
            name: "Kvadranty s min. 3 nerevidovanými záznamy",
            id: 'technical_common_count_3',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.protected_wms,
                params: {
                    'LAYERS': 'validation:taxon_quadrant_count_3',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    semafor_green: function (visibility, taxonId) {
        return new TileLayer({
            name: "Zelené záznamy přivázané ke kvadrantu",
            id: 'technical_semafor_green',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.protected_wms,
                params: {
                    'LAYERS': 'validation:taxon_per_quadrant_green',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    bayernflora_pladias_taxon_quads: function (visibility, taxonId) {
        return new TileLayer({
            name: "BayernFlora",
            id: 'data_bayernflora_pladias_taxon_quads',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.public_wms,
                params: {
                    'LAYERS': 'pladias:bayernflora_pladias_taxon_quads',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    bayernflora_fsg_taxon_quads: function (visibility, taxonId) {
        return new TileLayer({
            name: "BayernFlora",
            id: 'data_bayernflora_fsg_taxon_quads',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.public_wms,
                params: {
                    'LAYERS': 'pladias:bayernflora_fsg_taxon_quads',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    bayernflora_fsg_taxon_points: function (visibility, taxonId) {
        return new TileLayer({
            name: "BayernFlora",
            id: 'data_bayernflora_fsg_taxon_points',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.public_wms,
                params: {
                    'LAYERS': 'pladias:bayernflora_fsg_taxon_points',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver',
                minZoom: 10,
                maxZoom: 16
            })
        });
    },
    bayernflora_fsg_taxon_cz: function (visibility, taxonId) {
        return new TileLayer({
            name: "BayernFlora",
            id: 'data_bayernflora_fsg_taxon_cz',
            visible: visibility,
            source: new TileWMS({
                url: PladiasMap.geoserver.public_wms,
                params: {
                    'LAYERS': 'pladias:bayernflora_fsg_taxon_cz',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    }
};

PladiasMap.layersByProject = function (visibility, projectId, projectName, taxon) {
    return new TileLayer({
        name: projectName,
        id: projectId,
        visible: visibility,
        source: new TileWMS({
            url: PladiasMap.geoserver.protected_wms,
            params: {
                'LAYERS': 'validation:project_per_quadrant',
                'TILED': true,
                viewparams: "TAXON_ID:" + taxon + ";PROJECT_ID:" + projectId
            },
            serverType: 'geoserver'
        })
    });
};

export default PladiasMap;