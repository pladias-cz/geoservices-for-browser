'use strict';

import {METERS_PER_UNIT} from "ol/proj/Units";
import Circle from "ol/geom/Circle";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import projection from "./geo/projections";
import VectorLayer from "ol/layer/Vector";
import Collection from "ol/Collection";
import $ from "jquery";
import {commonStyles} from "./style/styles"
import {layers} from "./layers/vector_layers";

class PladiasMap {
    constructor(olMap,taxonId) {
        this.taxonId = taxonId;
        this.olMap = olMap;
    }

    getTaxonId() {
        return this.taxonId;
    }

    getOLMap() {
        return this.olMap;
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
            map: this.olMap,
            source: new VectorSource({
                features: collection,
                useSpatialIndex: false // optional, might improve performance
            }),
            style: function (feature, resolution) {
                return commonStyles.highlight(feature, resolution);
            },
            updateWhileAnimating: true, // optional, for instant visual feedback
            updateWhileInteracting: true // optional, for instant visual feedback
        });

        let highlight;

        const displayFeatureInfo = function (pixel) {
            // let layer = this.olMap.getLayer(layers.squaresVector().get('name'));
            let feature = this.olMap.forEachFeatureAtPixel(pixel, function (feature, layer) {
                return feature;
            });

            // let info = document.getElementById('square-hover');
            // if (feature) {
            //     info.innerHTML = 'pole ' + feature.get('id');//feature.getId() + ': ' + feature.get('id');
            // } else {
            //     info.innerHTML = '&nbsp;';
            // }
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

        this.olMap.on('pointermove', function(evt) {
            if (evt.dragging) {
                return;
            }
            let pixel = map.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel);
        });

        this.olMap.on('click', function(evt) {
            displayFeatureInfo(evt.pixel);
        });

        // this.olMap.getViewport().on('mousemove', function (evt) {
        //     let pixel = this.olMap.getEventPixel(evt.originalEvent);
        //     displayFeatureInfo(pixel);
        // });

    }

    fit2card() {
        this.DOMelement.height((this.DOMelement.closest('.resizeable').find('.card-block').height()) - 5);
    }

}