import {layers as tileLayers, layersByProject, layersByTaxon} from "./layers/tile_layers";
import {layersWithRadius, preprintLayers} from "./layers/vector_layers";

export const Geoservices = {
    getLayer: function (name, visibility) {
        //  console.log('vyžádána vrstva '+name+' s viditelnsotí '+visibility);
        return tileLayers[name](visibility);
    },
    getLayerWithRadius: function (name, visibility, radius) {
        //  console.log('vyžádána vrstva '+name+' s viditelnsotí '+visibility);
        return layersWithRadius[name](visibility, radius);
    },
    getPreprintLayer: function (name, color, radius) {
        return preprintLayers[name](color, radius);
    },
    getLayerByTaxon: function (name, visibility, taxon) {
        //console.log('vyžádána vrstva '+name+' s viditelnsotí '+visibility + 'k taxonu ' + taxon);
        return layersByTaxon[name](visibility, taxon);
    },
    getLayerByTaxonWithRadius: function (name, visibility, taxon, radius) {
        return layersWithRadius[name](visibility, taxon, radius);
    },
    getLayerByProject: function (project, visibility, taxon) {
        return layersByProject(visibility, project, taxon);
    },
};

