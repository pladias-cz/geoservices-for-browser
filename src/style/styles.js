import {Circle as CircleStyle, Style, Text,Fill, Stroke} from "ol/style";
import colors from "./colors";

export const styleFunction = {
    countRadius: function (zoom, correction, min) {
        return (min * (zoom - correction));
    },
    getStyle: function (name, radius = 1) {
        return commonStyles[name](radius);
    },
    getSquareText: function (feature, resolution) {
        let text = feature.get('name')+'';
        if (resolution > 300) {
            text = '';
        }
        return new Text({text: text, font: '12px sans-serif', fill: colors.text.black});
    },
};

export const commonStyles =
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
                stroke: colors.stroke.squares,
                text: new Text({
                    font: '12px sans-serif',
                    fill: colors.text.black
                })
            });
        },

        highlight: function (feature, resolution) {
            let text = resolution < 5000 ? styleFunction.getSquareText(feature, resolution) : '';
            return new Style({
                stroke: new Stroke({
                    color: '#f00',
                    width: 1
                }),
                fill: new Fill({
                    color: 'rgba(255,0,0,0.1)'
                }),
                text: new Text({
                    font: '12px Calibri,sans-serif',
                    text: text,
                    fill: new Fill({
                        color: '#000'
                    }),
                    stroke: new Stroke({
                        color: '#f00',
                        width: 3
                    })
                })
            });
        },
    };

export const preprintStyles = {
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