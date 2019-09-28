import {Circle as CircleStyle, Fill, Stroke, Style, Text} from "ol/style";
import colors from "./colors";

export const styleFunction = {
    countRadius: function (zoom, correction, min) {
        return (min * (zoom - correction));
    },
    getStyle: function (name, radius = 1) {
        return commonStyles[name](radius);
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
        squares: new Style({
            stroke: colors.stroke.squares,
            /** do not remove fill, zero alpha is not a mistake, see src/PladiasMap.js:48 */
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0)'
            }),
            text: new Text({
                font: '12px sans-serif',
                fill: colors.text.black
            })
        }),

        highlight: new Style({
            stroke: new Stroke({
                color: '#f00',
                width: 1
            }),
            fill: new Fill({
                color: 'rgba(255,0,0,0.1)'
            }),
            text: new Text({
                font: '12px Calibri,sans-serif',
                fill: new Fill({
                    color: '#000'
                })
            })
        })
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