import {Fill, Stroke, Style} from 'ol/style.js';
import Circle from 'ol/geom/Circle';
import VectorLayer from 'ol/layer/Vector';
import {METERS_PER_UNIT} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import projection from "./geo/projections";
import {layersByProject} from "./layers/tile_layers";

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
            projection: projection.WGS.getCode()
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
        return layersByProject(visibility, project, taxon);
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

export default PladiasMap;