import {Fill, Stroke} from "ol/style";

const colors = {
    stroke: {
        jisty: new Stroke({color: '#000000', width: 0}),
        neurceny: new Stroke({color: 'rgba(140, 140, 140, 1)', width: 1}),
        squares: new Stroke({color: '#319FD3', width: 1}),
        regions: new Stroke({color: 'rgba(110, 67, 2, 0.7)', width: 2})
    },
    fill: {
        jisty: new Fill({color: '#000000'}),
        neurceny: new Fill({color: 'rgba(140, 140, 140, 1)'}),
        orange: new Fill({color: 'rgba(255, 60, 0, 1)'}),
        yellow: new Fill({color: 'rgba(255, 255, 0, 1)'}),
        black: new Fill({color: 'rgba(0, 0, 0, 1)'}),
        gray: new Fill({color: 'rgba(160, 160, 160, 1)'}),
        blue: new Fill({color: 'rgba(0, 0, 200, 0.8)'}),
        khaki: new Fill({color: 'rgba(240, 230, 140, 1)'})
    },
    text: {
        black: new Fill({color: 'rgba(0, 0, 0, 0.7)'})
    }
};

export default colors;