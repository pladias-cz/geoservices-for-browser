import geoserver from "../geo/geoserver";
import {polygons as polygons} from "../geo/known_polygons";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import OSM from "ol/source/OSM";

export const layers = {
    osm: function (visibility) {
        return new TileLayer({
            title: 'Základní',
            name: 'Základní',
            id: 'base_OSM',
            type: 'base',
            visible: visibility,
            source: new OSM()
        });
    },
    zm25: function (visibility) {
        return new TileLayer({
            title: 'ZM 25',
            name: 'ZM 25',
            id: 'base_zm25',
            type: 'base',
            minResolution: 0,
            maxResolution: 12,
            visible: visibility,
            source: new TileWMS({
                url: 'http://geoportal.cuzk.cz/WMS_ZM25_PUB/service.svc/get',
                params: {'LAYERS': 'GR_ZM25'}
            })
        })
    },
    quads: function (visibility) {
        return new TileLayer({
            name: "Kvadranty",
            id: 'technical_quads',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.common_wms,
                params: {'LAYERS': 'commonStyles:quadrants', 'TILED': true},
                serverType: 'geoserver'
            })
        })
    },
    phytochor: function (visibility) {
        return new TileLayer({
            name: "Fytochoriony",
            id: 'technical_phytochor',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.common_wms,
                params: {'LAYERS': 'commonStyles:phytochorions', 'TILED': true},
                serverType: 'geoserver'
            })
        })
    },
    squares: function (visibility) {
        return new TileLayer({
            name: 'Čtvercová síť',
            id: 'technical_squares',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.common_wms,
                // url: geoBasePath + '/geoserver/validation/wms',
                params: {'LAYERS': 'commonStyles:squares', 'TILED': true},
                serverType: 'geoserver'
            })
        });
    },
    regions: function (visibility) {
        return new TileLayer({
            name: 'Regiony',
            id: 'technical_regions',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.common_wms,
                params: {'LAYERS': 'commonStyles:regions', 'TILED': true,'viewparams': 'ID:' + polygons.sumava.id},
                serverType: 'geoserver'
            })
        });
    },

};

export const layersByProject = function (visibility, projectId, projectName, taxon) {
    return new TileLayer({
        name: projectName,
        id: projectId,
        visible: visibility,
        source: new TileWMS({
            url: geoserver.protected_wms,
            params: {
                'LAYERS': 'validation:project_per_quadrant',
                'TILED': true,
                viewparams: "TAXON_ID:" + taxon + ";PROJECT_ID:" + projectId
            },
            serverType: 'geoserver'
        })
    });
};

export const layersByTaxon = {
    semafor: function (visibility, taxonId) {
        return new TileLayer({
            name: "Záznamy přivázané ke kvadrantu",
            id: 'technical_semafor',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.protected_wms,
                params: {
                    'LAYERS': 'validation:taxon_per_quadrant',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    semaforPublic: function (visibility, taxonId) {
        return new TileLayer({
            name: "Záznamy přivázané ke kvadrantu",
            id: 'technical_semafor',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.public_wfs,
                params: {'LAYERS': 'vektor:semafor', 'TILED': true, 'viewparams': 'TAXON_ID:' + taxonId},
                serverType: 'geoserver'
            })
        });
    },
    common_count_1: function (visibility, taxonId) {
        return new TileLayer({
            name: "Kvadranty s min. 1 nerevidovaným záznamem",
            id: 'technical_common_count_1',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.protected_wms,
                params: {
                    'LAYERS': 'validation:taxon_quadrant_count_1',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    common_count_2: function (visibility, taxonId) {
        return new TileLayer({
            name: "Kvadranty s min. 2 nerevidovanými záznamy",
            id: 'technical_common_count_2',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.protected_wms,
                params: {
                    'LAYERS': 'validation:taxon_quadrant_count_2',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    common_count_3: function (visibility, taxonId) {
        return new TileLayer({
            name: "Kvadranty s min. 3 nerevidovanými záznamy",
            id: 'technical_common_count_3',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.protected_wms,
                params: {
                    'LAYERS': 'validation:taxon_quadrant_count_3',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    semafor_green: function (visibility, taxonId) {
        return new TileLayer({
            name: "Zelené záznamy přivázané ke kvadrantu",
            id: 'technical_semafor_green',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.protected_wms,
                params: {
                    'LAYERS': 'validation:taxon_per_quadrant_green',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    bayernflora_pladias_taxon_quads: function (visibility, taxonId) {
        return new TileLayer({
            name: "BayernFlora",
            id: 'data_bayernflora_pladias_taxon_quads',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.public_wms,
                params: {
                    'LAYERS': 'pladias:bayernflora_pladias_taxon_quads',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    bayernflora_fsg_taxon_quads: function (visibility, taxonId) {
        return new TileLayer({
            name: "BayernFlora",
            id: 'data_bayernflora_fsg_taxon_quads',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.public_wms,
                params: {
                    'LAYERS': 'pladias:bayernflora_fsg_taxon_quads',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    },
    bayernflora_fsg_taxon_points: function (visibility, taxonId) {
        return new TileLayer({
            name: "BayernFlora",
            id: 'data_bayernflora_fsg_taxon_points',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.public_wms,
                params: {
                    'LAYERS': 'pladias:bayernflora_fsg_taxon_points',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver',
                minZoom: 10,
                maxZoom: 16
            })
        });
    },
    bayernflora_fsg_taxon_cz: function (visibility, taxonId) {
        return new TileLayer({
            name: "BayernFlora",
            id: 'data_bayernflora_fsg_taxon_cz',
            visible: visibility,
            source: new TileWMS({
                url: geoserver.public_wms,
                params: {
                    'LAYERS': 'pladias:bayernflora_fsg_taxon_cz',
                    'TILED': true,
                    'viewparams': 'TAXON_ID:' + taxonId
                },
                serverType: 'geoserver'
            })
        });
    }
};