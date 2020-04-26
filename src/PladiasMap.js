'use strict';

import {METERS_PER_UNIT} from "ol/proj/Units";
import Circle from "ol/geom/Circle";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import projection from "./geo/projections";
import VectorLayer from "ol/layer/Vector";
import {commonStyles} from "./style/styles"
import {Map, View} from 'ol';

import "ol/ol.css";

export class PladiasMap {

    constructor(target, layers, viewOptions, controls = []) {
        this.olMap = new Map({
            target: target,
            layers: layers,
            view: new View(viewOptions),
            controls: controls
        });
    }

    setTaxonId(id) {
        this.taxonId = id;
        return this;
    }

    getTaxonId() {
        return this.taxonId;
    }

    getOLMap() {
        return this.olMap;
    }

    drawCircleInMeter(radius) {
        let DOMElement = this.getOLMap().getTargetElement();
        let circleRadius = (radius / METERS_PER_UNIT.m) * 2;
        let center = DOMElement.getView().getCenter();

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

        this.getOLMap().addLayer(vectorLayer);
        return this;
    }

    highlightSquare(infoElement = null) {
        /** https://openlayers.org/en/latest/examples/vector-layer.html
         * to work well, there must be fill in style of squaresLayer, even with zero Alpha-channel, otherwise it does not render and function forEachFeatureAtPixel() cannot catch its existence.. */
        const map = this.getOLMap();
        const featureOverlay = new VectorLayer({
            map: map,
            source: new VectorSource(),
            style: function () {
                return commonStyles.highlight;
            }
            /** if you like to change text during highlight...

             style: function(feature) {
                commonStyles.highlight.getText().setText(feature.get('name'));
                return commonStyles.highlight;
            }
             * */
        });

        let highlight;

        const displayFeatureInfo = function (pixel) {
            let feature = map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });

            if (infoElement !== null) {
                if (feature) {
                    infoElement.innerHTML = feature.get('name');
                } else {
                    infoElement.innerHTML = '&nbsp;';
                }
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

        map.on('pointermove', function (evt) {
            if (evt.dragging) {
                return;
            }
            let pixel = map.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel);
        });
        return this;
    }

    fit2card() {
        let DOMElement = this.getOLMap().getTargetElement();
        DOMElement.height((DOMElement.closest('.resizeable').find('.card-block').height()) - 5);
        return this;
    }

}