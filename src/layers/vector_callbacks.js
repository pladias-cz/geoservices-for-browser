/**
 * this is problematic part for Webpack - we need to have callbacks in global namespace
 *
 * TODO - solve it somehow
 */

import vectorSources from "./vector_sources";
import projection from "../geo/projections";
import GeoJSON from "ol/format/GeoJSON";

const vectorCallbacks = {
    loadSquares: function (response) {
        const format = new GeoJSON();
        vectorSources.squares.addFeatures(format.readFeatures(response, {featureProjection: projection.OL}));
    },
    loadRegions: function (response) {
        const format = new GeoJSON();
        vectorSources.regions.addFeatures(format.readFeatures(response, {featureProjection: projection.OL}));
    },
    loadNeurceny: function (response) {
        const format = new GeoJSON();
        vectorSources.neurceny.addFeatures(format.readFeatures(response, {featureProjection: projection.OL}));
    },
    loadJisty: function (response) {
        const format = new GeoJSON();
        vectorSources.jisty.addFeatures(format.readFeatures(response, {featureProjection: projection.OL}));
    },
};

export default vectorCallbacks;