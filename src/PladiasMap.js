'use strict';

import {METERS_PER_UNIT} from "ol/proj/Units";
import Circle from "ol/geom/Circle";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import projection from "./geo/projections";
import VectorLayer from "ol/layer/Vector";
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

        this.getOLMap().addLayer(vectorLayer);
    }

    highlightSquare() {
        //https://openlayers.org/en/latest/examples/vector-layer.html
        //TODO nefunguje jak má - ke zvýraznění dojde, ale pouze po najetí na zobrazený popisek polygonu. Pokud je popisek skrytý, tak to jen náhodně reaguje při pohybu v okolí centroidu či nepravidelně i jinde
        const map = this.getOLMap();
        const featureOverlay = new VectorLayer({
            map: map,
            source: new VectorSource(),
            style: function () {
                return commonStyles.highlight;
            }
        });

        let highlight;

        const displayFeatureInfo = function (pixel) {
            let feature = map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });

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
    }

    fit2card() {
        let DOMElement =  this.getOLMap().getTargetElement();
       DOMElement.height((DOMElement.closest('.resizeable').find('.card-block').height()) - 5);
    }

}