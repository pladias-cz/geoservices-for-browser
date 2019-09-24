import {commonStyles, preprintStyles, styleFunction} from "../style/styles";
import vectorSources from "./vector_sources";
import VectorLayer from "ol/layer/Vector";

export const layers = {
    regionsVector: function (visibility) {
        return new VectorLayer({
            name: 'Regiony',
            id: 'technical_regions',
            visible: visibility,
            source: vectorSources.regions,
            style: commonStyles.regions
        });

    },
    squaresVector: function (visibility) {
        return new VectorLayer({
            name: 'Čtvercová síť',
            id: 'technical_squares',
            visible: visibility,
            source: vectorSources.squares,
            style: commonStyles.squares
        });

    },
    squaresNoCallbackVector: function (visibility) {
        return new VectorLayer({
            name: 'Čtvercová síť',
            id: 'technical_squares',
            visible: visibility,
            // source: new VectorSource({
            //     url: 'https://geoserver.ibot.cas.cz/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=shared:squares&outputFormat=application%2Fjson',
            //     format: new GeoJSON()
            // }),
            source: vectorSources.squaresNoCallback,
            style: commonStyles.squares
        });

    },

};

export const layersWithRadius = {
    neurcenyVector: function (visibility, radius) {
        return new VectorLayer({
            name: 'Šedé záznamy',
            id: 'uknown_validity_status',
            visible: visibility,
            source: vectorSources.neurceny,
            style: styleFunction.getStyle('neurceny', radius)
        });
    },
    jistyVector: function (visibility, radius) {
        return new VectorLayer({
            name: 'Zelené záznamy',
            id: 'Accepted validity_status',
            visible: visibility,
            source: vectorSources.jisty,
            style: styleFunction.getStyle('jisty', radius)
        });
    },
};

export const preprintLayers = {
    preprintJisty: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintJisty,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintNejisty: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintNejisty,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintCommon: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintCommon,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintCommonRecent: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintCommonRecent,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintCommonZanik: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintCommonZanik,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintHerb: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintHerb,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintNeherb: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintNeherb,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintPestovany: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintPestovany,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintPuvodni: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintPuvodni,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintNepuvodni: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintNepuvodni,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintNeurceny: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintNeurceny,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintRecent: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintRecent,
            style: preprintStyles.getStyle(color, radius)
        });
    },
    preprintZanik: function (color, radius) {
        return new VectorLayer({
            source: vectorSources.preprintZanik,
            style: preprintStyles.getStyle(color, radius)
        });
    },
};