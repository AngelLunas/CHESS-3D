function positionCamera (color) {
    if (color === 'white' || color === 'black') {
        return [0, 80, 100]
    } else {
        return [0, 120, 0]
    }
}

function zoomCamera () {
    if (window.innerWidth <= 768 && window.innerWidth > 500) {
        return 0.6
    } else if (window.innerWidth <= 500) {
        return 0.45
    }
}

export {
    positionCamera,
    zoomCamera
}