import {get as getProjection} from 'ol/proj';
import {defaults as defaultControls, OverviewMap} from 'ol/control.js';
import * as PladiasServer from './pladias_server';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js';
import Circle from 'ol/geom/Circle';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {transform, transformExtent, getTransform, METERS_PER_UNIT} from 'ol/proj';
import {applyTransform} from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import OSMSource from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import * as loadingStrategy from 'ol/loadingstrategy';
import $ from 'jquery';

const PladiasMap = {};

PladiasMap.projection = {
        client: getProjection('EPSG:3857'),
        server: getProjection('EPSG:4326')
};

PladiasMap.center = {
        CR: function () {
                return transform([15.4, 49.85], PladiasMap.projection.server, PladiasMap.projection.client)
        },
        Sumava: function () {
                return transform([13.8, 48.95], PladiasMap.projection.server, PladiasMap.projection.client)
        }
};

PladiasMap.extent = {
        rawCR: function () {
                let extent = [14.9, 48.6, 16.1, 51.1];
                return applyTransform(extent, getTransform(PladiasMap.projection.server, PladiasMap.projection.client));
        },
        transformPreprint: function (extent) {
                return transformExtent(extent, PladiasMap.projection.client, PladiasMap.projection.server).join(',');
        }
};

PladiasMap.controls = defaultControls().extend([
    new OverviewMap()
]);

// PladiasMap.controls = {
//     withExtent: [
//         new ol.control.Attribution(),
//         new ol.control.Zoom(),
//         new ol.control.ZoomToExtent({extent: PladiasMap.extent.rawCR()}),
//     ]
// };

PladiasMap.geoserver = {
    public_wfs: 'https://geoserver.ibot.cas.cz/pladias_wfs/ows',
    public_wms: 'https://geoserver.ibot.cas.cz/pladias/ows',
    common_wfs: 'https://geoserver.ibot.cas.cz/common_wfs/ows',
    common_wms: 'https://geoserver.ibot.cas.cz/common/ows',
    protected_wms: PladiasServer.getGeoBasePath() + '/geoserver/validation/wms',
    preprint_wfs: PladiasServer.getAppBasePath() + '/geoserver2/public/ows'
};

PladiasMap.constants = {
    sumava: 1,
}

PladiasMap.functions = {
    convertDMS: function (coordinate, type) {
        let coords = [];

        let abscoordinate = Math.abs(coordinate)
        let coordinatedegrees = Math.floor(abscoordinate);

        let coordinateminutes = (abscoordinate - coordinatedegrees) / (1 / 60);
        let tempcoordinateminutes = coordinateminutes;
        coordinateminutes = Math.floor(coordinateminutes);
        let coordinateseconds = (tempcoordinateminutes - coordinateminutes) / (1 / 60);
        coordinateseconds = Math.round(coordinateseconds * 10);
        coordinateseconds /= 10;

        if (coordinatedegrees < 10)
            coordinatedegrees = "0" + coordinatedegrees;

        if (coordinateminutes < 10)
            coordinateminutes = "0" + coordinateminutes;

        if (coordinateseconds < 10)
            coordinateseconds = "0" + coordinateseconds;

        coords[0] = coordinatedegrees;
        coords[1] = coordinateminutes;
        coords[2] = coordinateseconds;
        coords[3] = this.getHemi(coordinate, type);

        return coords[0] + "°" + coords[1] + "\'" + coords[2] + "\"" + coords[3];
    },
    ol2gps: function (coordinates) {
        return transform(coordinates, PladiasMap.projection.client.getCode(), PladiasMap.projection.server.getCode());
    },
    gps2ol: function (coordinates) {
        return transform(coordinates, PladiasMap.projection.server.getCode(), PladiasMap.projection.client.getCode());
    },
    getHemi: function (coordinate, type) {
        let coordinatehemi = "";
        if (type === 'LAT') {
            if (coordinate >= 0) {
                coordinatehemi = "N";
            }
            else {
                coordinatehemi = "S";
            }
        }
        else if (type === 'LON') {
            if (coordinate >= 0) {
                coordinatehemi = "E";
            } else {
                coordinatehemi = "W";
            }
        }

        return coordinatehemi;
    },
    drawCircleInMeter: function (map, radius) {
        let circleRadius = (radius / METERS_PER_UNIT.m) * 2;
        let center = map.getView().getCenter();

        let circle = new Circle(center, circleRadius);
        let circleFeature = new Feature(circle);

        // Source and vector layer
        const vectorSource = new VectorSource({
            projection: PladiasMap.projection.server.getCode()
        });
        vectorSource.addFeature(circleFeature);
        const vectorLayer = new VectorLayer({
            name: "Polohová přesnost záznamu (coords buffer)",
            id: 'coordspreci',
            source: vectorSource
        });

        map.addLayer(vectorLayer);
    },
    computeSquare: function (lon, lat) {
        //if (lon>12 && lon<19.1 && lat>48.53 && lat<51.07)
        let row = Math.round(559.5 - (10 * lat));
        let col = Math.round((6 * lon) - 34.5);
        return row + '' + col;
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


PladiasMap.colors = {
    stroke: {
        jisty: new Stroke({color: '#000000', width: 0}),
        neurceny: new Stroke({color: 'rgba(200, 200, 200, 1)', width: 1})
    },
    fill: {
        jisty: new Fill({color: '#000000'}),
        neurceny: new Fill({color: 'rgba(210, 210, 210, 1)'}),
        orange: new Fill({color: 'rgba(255, 60, 0, 1)'}),
        yellow: new Fill({color: 'rgba(255, 255, 0, 1)'}),
        black: new Fill({color: 'rgba(0, 0, 0, 1)'}),
        gray: new Fill({color: 'rgba(160, 160, 160, 1)'}),
        blue: new Fill({color: 'rgba(0, 0, 200, 0.8)'}),
        khaki: new Fill({color: 'rgba(240, 230, 140, 1)'})
    }
};

PladiasMap.styles = {
    countRadius: function (zoom, correction, min) {
        return ( min * (zoom - correction));
    },
    getStyle: function (name, radius = 1) {
        return PladiasMap.styles[name](radius);
    },
    jisty: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: PladiasMap.colors.fill.jisty,
                stroke: PladiasMap.colors.stroke.jisty
            })
        })];
    },
    neurceny: function (radius) {
        return new Style({
            image: new CircleStyle({
                radius: radius,
                fill: PladiasMap.colors.fill.neurceny,
                stroke: PladiasMap.colors.stroke.jisty
            })
        });
    },
    squares: function (feature, resolution) {
        //https://openlayers.org/en/latest/examples/vector-labels.html
        return new Style({
            stroke: new Stroke({
                color: 'blue',
                width: 1
            }),
            text: PladiasMap.styles.getSquareText(feature, resolution)
        });
    },
    getSquareText: function (feature, resolution) {
        let text = feature.get('id').toString();
        if (resolution > 300) {
            text = '';
        }
        return new Text({text: text, font: '12px sans-serif', fill: new Fill({color: 'rgba(0, 0, 0, 0.7)'})});
    },
    regions: function (feature, resolution) {
        //https://openlayers.org/en/latest/examples/vector-labels.html
        return new Style({
            stroke: new Stroke({
                color: 'rgba(110, 67, 2, 0.7)',
                width: 2
            })
        });
    },
};

PladiasMap.preprintStyles = {
    getStyle: function (name, radius = 1) {
        return PladiasMap.preprintStyles[name](radius);
    },
    orange: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: PladiasMap.colors.fill.orange,
                stroke: PladiasMap.colors.stroke.jisty
            })
        })];
    },
    yellow: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: PladiasMap.colors.fill.yellow,
                stroke: PladiasMap.colors.stroke.jisty
            })
        })];
    },
    black: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: PladiasMap.colors.fill.black,
                stroke: PladiasMap.colors.stroke.jisty
            })
        })];
    },
    gray: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: PladiasMap.colors.fill.gray,
                stroke: PladiasMap.colors.stroke.jisty
            })
        })];
    },
    blue: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: PladiasMap.colors.fill.blue,
                stroke: PladiasMap.colors.stroke.jisty
            })
        })];
    },
    khaki: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: PladiasMap.colors.fill.khaki,
                stroke: PladiasMap.colors.stroke.jisty
            })
        })];
    },
}

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
        projection: PladiasMap.projection.client
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
        projection: PladiasMap.projection.client
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
        projection: PladiasMap.projection.client
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
        projection: PladiasMap.projection.client
    }),
    preprintJisty: new VectorLayer({
        format: new GeoJSON(),
        url: PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_jisty' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintNejisty: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_nejisty' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintCommon: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_common' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintCommonRecent: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_common_recent' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintCommonZanik: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_common_zanik' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintHerb: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_herb' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintNeherb: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_neherb' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintPestovany: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_pestovany' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintPuvodni: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_puvodni' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintNepuvodni: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_nepuvodni' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintNeurceny: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_neurceny' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintRecent: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_recent' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),
    preprintZanik: new VectorLayer({
        format: new GeoJSON(),
        url:PladiasServer.getAppBasePath() + '/geoserver2/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:preprint_zanik' +
            '&viewparams=TAXON_ID:' + PladiasMap.taxon + '&outputFormat=application/json',
        serverType: 'geoserver',
        strategy: loadingStrategy.bbox,
        projection: PladiasMap.projection.client
    }),

};

PladiasMap.vectorCallbacks = {
    loadSquares: function (response) {
        var format = new GeoJSON();
        PladiasMap.vectorSources.squares.addFeatures(format.readFeatures(response, {featureProjection: PladiasMap.projection.client}));
    },
    loadRegions: function (response) {
        var format = new GeoJSON();
        PladiasMap.vectorSources.regions.addFeatures(format.readFeatures(response, {featureProjection: PladiasMap.projection.client}));
    },
    loadNeurceny: function (response) {
        var format = new GeoJSON();
        PladiasMap.vectorSources.neurceny.addFeatures(format.readFeatures(response, {featureProjection: PladiasMap.projection.client}));
    },
    loadJisty: function (response) {
        var format = new GeoJSON();
        PladiasMap.vectorSources.jisty.addFeatures(format.readFeatures(response, {featureProjection: PladiasMap.projection.client}));
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