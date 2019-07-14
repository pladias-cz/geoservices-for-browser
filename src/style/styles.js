import {Circle as CircleStyle, Fill, Stroke, Style, Text} from "ol/style";
import colors from "./colors";

export const styleFunction = {
    countRadius: function (zoom, correction, min) {
        return (min * (zoom - correction));
    },
    getStyle: function (name, radius = 1) {
        return common[name](radius);
    },
    getSquareText: function (feature, resolution) {
        let text = feature.get('id').toString();
        if (resolution > 300) {
            text = '';
        }
        return new Text({text: text, font: '12px sans-serif', fill: new Fill({color: 'rgba(0, 0, 0, 0.7)'})});
    },
};

export const common =
    {
        jisty: function (radius) {
            return [new Style({
                image: new CircleStyle({
                    radius: radius,
                    fill: colors.fill.jisty,
                    stroke: colors.stroke.jisty
                })
            })];
        },
        neurceny: function (radius) {
            return new Style({
                image: new CircleStyle({
                    radius: radius,
                    fill: colors.fill.neurceny,
                    stroke: colors.stroke.jisty
                })
            });
        },
        squares: function (feature, resolution) {
            //https://openlayers.org/en/latest/examples/vector-labels.html
            return new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 1
                }),
                text: styleFunction.getSquareText(feature, resolution)
            });
        },

        regions: function (feature, resolution) {
            //https://openlayers.org/en/latest/examples/vector-labels.html
            return new Style({
                stroke: new Stroke({
                    color: 'rgba(110, 67, 2, 0.7)',
                    width: 2
                })
            });
        },
    };

export const preprint = {
    getStyle: function (name, radius = 1) {
        return this[name](radius);
    },
    orange: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: colors.fill.orange,
                stroke: colors.stroke.jisty
            })
        })];
    },
    yellow: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: colors.fill.yellow,
                stroke: colors.stroke.jisty
            })
        })];
    },
    black: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: colors.fill.black,
                stroke: colors.stroke.jisty
            })
        })];
    },
    gray: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: colors.fill.gray,
                stroke: colors.stroke.jisty
            })
        })];
    },
    blue: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: colors.fill.blue,
                stroke: colors.stroke.jisty
            })
        })];
    },
    khaki: function (radius) {
        return [new Style({
            image: new CircleStyle({
                radius: radius,
                fill: colors.fill.khaki,
                stroke: colors.stroke.jisty
            })
        })];
    },
};