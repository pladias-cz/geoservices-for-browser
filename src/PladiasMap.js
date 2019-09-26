'use strict';

import {METERS_PER_UNIT} from "ol/proj/Units";
import Circle from "ol/geom/Circle";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import projection from "./geo/projections";
import VectorLayer from "ol/layer/Vector";
import Collection from "ol/Collection";
import {commonStyles} from "./style/styles"

export class PladiasMap {
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
        const map = this.getOLMap();
        //vector square handling
        let collection = new Collection();
        const featureOverlay = new VectorLayer({
            map: map,
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
            let feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
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

        map.on('pointermove', function(evt) {
            if (evt.dragging) {
                return;
            }
            let pixel = map.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel);
        });

        map.on('click', function(evt) {
            displayFeatureInfo(evt.pixel);
        });

        // this.olMap.getViewport().on('mousemove', function (evt) {
        //     let pixel = this.olMap.getEventPixel(evt.originalEvent);
        //     displayFeatureInfo(pixel);
        // });

    }

    fit2card() {
        let DOMElement =  this.getOLMap().getTargetElement();
       DOMElement.height((DOMElement.closest('.resizeable').find('.card-block').height()) - 5);
    }

}