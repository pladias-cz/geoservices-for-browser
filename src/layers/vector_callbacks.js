/**
 * this is problematic part for Webpack - we need to have callbacks in global namespace
 *
 * TODO - solve it somehow
 */

import * as vectorSources from "./vector_sources";
import {projection} from "../geo/projections";

const vectorCallbacks = {
    loadSquares: function (response) {
        var format = new GeoJSON();
        vectorSources.squares.addFeatures(format.readFeatures(response, {featureProjection: projection.OL}));
    },
    loadRegions: function (response) {
        var format = new GeoJSON();
        vectorSources.regions.addFeatures(format.readFeatures(response, {featureProjection: projection.OL}));
    },
    loadNeurceny: function (response) {
        var format = new GeoJSON();
        vectorSources.neurceny.addFeatures(format.readFeatures(response, {featureProjection: projection.OL}));
    },
    loadJisty: function (response) {
        var format = new GeoJSON();
        vectorSources.jisty.addFeatures(format.readFeatures(response, {featureProjection: projection.OL}));
    },
};

export default vectorCallbacks;