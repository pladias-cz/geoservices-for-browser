import Overlay from "ol/Overlay";

/** https://openlayers.org/en/latest/examples/popup.html*/
const overlays = {
    popup: function (handle) {
        let container = document.getElementById(handle);
        return new Overlay({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            }
        });
    },
};

export default overlays;