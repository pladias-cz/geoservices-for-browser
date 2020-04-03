import {commonStyles, preprintStyles, styleFunction} from "../style/styles";
import vectorSources from "./vector_sources";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import projection from "../geo/projections";
import {bbox as defaultStrategy} from "ol/loadingstrategy";
import paths from "../geo/geoserver";


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
            style: function (feature, resolution) {
                let text = ' ';
                if (resolution < 300) {
                    text = feature.get('name');
                }
                commonStyles.squares.getText().setText(text);
                return commonStyles.squares;
            }
        });
    },

};

export const layersWithRadius = {
    neurcenyVector: function (visibility, taxonId, radius) {
        return new VectorLayer({
            name: 'Šedé záznamy',
            id: 'uknown_validity_status',
            visible: visibility,
            source: new VectorSource({
                format: new GeoJSON(),
                strategy: defaultStrategy,
                projection: projection.OL,
                url: paths.public_wfs + '?service=WFS&version=1.0.0&request=GetFeature&typeName=neurceny&outputFormat=application%2Fjson&VIEWPARAMS=TAXON_ID:' + taxonId,
                serverType: 'geoserver'
            }),
            style: styleFunction.getStyle('neurceny', radius)
        });
    },
    jistyVector: function (visibility, taxonId, radius) {
        return new VectorLayer({
            name: 'Zelené záznamy',
            id: 'accepted_validity_status',
            visible: visibility,
            source: new VectorSource({
                format: new GeoJSON(),
                strategy: defaultStrategy,
                projection: projection.OL,
                url: paths.public_wfs + '?service=WFS&version=1.0.0&request=GetFeature&typeName=jisty&outputFormat=application%2Fjson&VIEWPARAMS=TAXON_ID:' + taxonId,
                serverType: 'geoserver'
            }),
            style: styleFunction.getStyle('jisty', radius)
        });
    }
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