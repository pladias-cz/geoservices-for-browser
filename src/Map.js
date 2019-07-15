'use strict';

import {METERS_PER_UNIT} from "ol/proj/Units";
import Circle from "ol/geom/Circle";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import projection from "./geo/projections";
import VectorLayer from "ol/layer/Vector";
import Collection from "ol/Collection";
import {Fill, Stroke, Style} from "ol/style";
import $ from "jquery";

class Map {
    constructor(taxonId, DOMelement) {
        this.taxonId = taxonId;
        this.DOMelement = DOMelement;
    }

    getTaxonId() {
        return this.taxonId;
    }

    drawCircleInMeter(radius) {
        let circleRadius = (radius / METERS_PER_UNIT.m) * 2;
        let center = this.DOMelement.getView().getCenter();

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

        this.DOMelement.addLayer(vectorLayer);
    }

    highlightSquare() {
        //vector square handling
        let collection = new Collection();
        const featureOverlay = new VectorLayer({
            map: this.DOMelement,
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

            let feature = this.DOMelement.forEachFeatureAtPixel(pixel, function (feature, layer) {
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
        $(this.DOMelement.getViewport()).on('mousemove', function (evt) {
            let pixel = this.DOMelement.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel);
        });

    }

    fit2card() {
        this.DOMelement.height((this.DOMelement.closest('.resizeable').find('.card-block').height()) - 5);
    }

}