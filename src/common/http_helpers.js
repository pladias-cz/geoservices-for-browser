export function isLocalhost() {
    return (location.hostname === "localhost" || location.hostname === "127.0.0.1");
}

export function redirect(url, timeout=0) {
    setTimeout(function () {
        window.location.href = url;
    }, timeout);
}

export function getGeoBasePath(){
    if (""===location.port){
       return  location.protocol + '//' + location.hostname;
    }
    return  location.protocol + '//' + location.hostname + ":" + location.port;
}

export function getAppBasePath() {
    return getGeoBasePath();

}

