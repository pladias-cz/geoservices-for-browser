export function isLocalhost() {
    return (location.hostname === "localhost" || location.hostname === "127.0.0.1");
}

export function redirect(url, timeout=0) {
    setTimeout(function () {
        window.location.href = url;
    }, timeout);
}

export function getHost() {
    return location.hostname;
}

export function getPort() {
    if (""===location.port){
        return "80";
    }
    return location.port;
}

export function getProtocol() {
    return location.protocol;
}

export function getGeoBasePath(){
    return getProtocol() + '//' + getHost() + ":" + getPort();
}

export function getAppBasePath() {
    return getGeoBasePath();

}

